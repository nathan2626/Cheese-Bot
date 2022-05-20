require("dotenv").config();
const puppeteer = require("puppeteer");
const { Client } = require("pg");
const { faker } = require('@faker-js/faker');

(async () => {
  console.log("🧀 Cheesebot 🤖");

  process.stdout.write("First Step  1️⃣ : Connecting to PostgreSQL database: ");

  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  client.connect(function (err) {
    if (err) throw err;
    console.log("ok");
  });

  const browser = await puppeteer.launch(); // { headless: false }
  const page = await browser.newPage();

  /*const randomPrice = faker.datatype.number({
    'min': 2,
    'max': 15
  });*/

  await page.goto("https://www.fromages.com/fr/recettes");

  process.stdout.write("Second step  2️⃣ : Parsing recipes list ");
  const recipesUrl = await page.evaluate((client) => {
    let recipes = [];

    const lists = document.querySelectorAll(".recette_liste_unit");

    for (const list of lists) {
      const url = list.querySelector(".recette_liste_titre a").href;
      recipes.push(url);
    }

    return recipes;
  });

  let recipes = [];

  for (url of recipesUrl) {
    try {
      await page.goto(url);

      const results = await page.evaluate(() => {
        const name = document.querySelector(".recette_detail_nom > h1").innerText;
        const nbrpers = 4;
        const difficult = 2;
        const time = 20;
        const cook = 25;
        const ingredients = document.querySelector(
          ".recette_detail_bloc_ingredients > .col-xs-12 > .font-book"
        ).innerText;
        const steps = document.querySelector(
          ".recette_detail_etapes"
        ).innerText;
        const cheese_name = document.querySelector(
          ".fromage_liste_nom a"
        ).innerText;
        const img = document.querySelector(
          ".recette_detail_photo"
        ).src;

        return {
          name: name,
          nbrpers: nbrpers,
          difficult: difficult,
          time: time,
          cook: cook,
          ingredients: ingredients,
          steps: steps,
          cheese_name: cheese_name,
          img: img,
        };
      });

      recipes.push(results);
      process.stdout.write(".");
    } catch (e) {
      //console.log(e);
    }
  }

  console.log(" done");

  process.stdout.write("Final step 3️⃣ : Add recipes in database ");

  for (recipe of recipes) {
    try {
      const res = await client.query(
        "INSERT INTO recipes (name, nbrpers, difficult, time, cook, ingredients, steps, cheese_name, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [recipe.name, recipe.nbrpers, recipe.difficult, recipe.time, recipe.cook, recipe.ingredients, recipe.steps, recipe.cheese_name, recipe.img]
      );
      process.stdout.write(".");
    } catch (err) {
      console.log(err.stack);
    }
  }

  process.stdout.write(" done");

  await browser.close();
  process.exit();
})();