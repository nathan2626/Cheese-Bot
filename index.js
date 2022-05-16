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

  await page.goto("https://www.fromages.com/fr/fromages/fromages-a-la-coupe");

  process.stdout.write("Second step  2️⃣ : Parsing cheeses list ");
  const cheesesUrl = await page.evaluate((client) => {
    let cheeses = [];

    const lists = document.querySelectorAll(".fromage_liste_unit");

    for (const list of lists) {
      const url = list.querySelector(".fromage_liste_nom a").href;
      const category = list.querySelector(".fromage_liste_region").innerText;
      cheeses.push(url, category);
    }

    return cheeses;
  });

  let cheeses = [];

  for (url of cheesesUrl) {
    try {
      await page.goto(url);

      const results = await page.evaluate(() => {
        const name = document.querySelector(".fromage_detail_titre").innerText;
        const price = 5;
        const description = document.querySelector(
          ".fromage_detail_description"
        ).innerHTML;
        const subtitle = document.querySelector(
          ".fromage_detail_soustitre"
        ).innerText;
        const pound = document.querySelector(
          ".picto_poids > .fond-marron-clair > .font-bold"
        ).innerText;
        const milk = document.querySelector(
          ".picto_lait > .fond-marron-clair > .color-blanc > .font-bold"
        ).innerText;
        const refining = document.querySelector(
          ".picto_affinage > .fond-marron-clair > .font-bold"
        ).innerText;
        const pate = document.querySelector(
          ".picto_pate > .fond-marron-clair > .color-blanc > .font-bold"
        ).innerText;
        const wine = document.querySelector(
          ".fromage_detail_vins_liste"
        ).innerText;
        const img = document.querySelector(
          ".owl-carousel-fromagedetail > .owl-stage-outer > .owl-stage > .owl-item > .item > .img-responsive"
        ).src;

        return {
          subtitle: subtitle,
          name: name,
          wine: wine,
          pate: pate,
          refining: refining,
          milk: milk,
          pound: pound,
          description: description,
          price: price,
          img: img,
        };
      });

      cheeses.push(results);
      process.stdout.write(".");
    } catch (e) {
      //console.log(e);
    }
  }

  console.log(" done");

  process.stdout.write("Final step 3️⃣ : Add cheeses in database ");

  for (cheese of cheeses) {
    try {
      const res = await client.query(
        "INSERT INTO cheeses (name, subtitle, wine, pate, refining, milk, pound, description, price, img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [cheese.name, cheese.subtitle, cheese.wine, cheese.pate, cheese.refining, cheese.milk, cheese.pound, cheese.description, cheese.price, cheese.img]
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