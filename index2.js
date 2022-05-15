const puppeteer = require("puppeteer");


/*
const { Client } = require('pg')
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password : process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

client.query("INSERT INTO cheeses (name, price, description, subtitle, pound, milk, refining, pate, wine  ) VALUES ('Test', 5, 'test description', 'short descr', '5grm', 'de vache', '1 an', 'molle', 'vin blanc' )");
*/

/*const { faker } = require('@faker-js/faker');

const randomName = faker.name.findName(); 
const randomEmail = faker.internet.email();
const randomPhoneNumber = faker.phone.phoneNumber(); */

/*get random value from array
var colors = ["red","blue","green","yellow"];
var randColor = colors[Math.floor(Math.random() * colors.length)];*/


// Puppeteer
(async () => {

  //const Db =  require("./bootstrap/Db");
  //const db = new Db();

  const mysql = require('mysql');
  const connexionMysql = mysql.createConnection({
    user: "user_name",
    host: "host",
    database: "database",
    password : "password",
    port: 'port'
  })

  connexionMysql.connect(function(err){
    if(err) throw err;

    //let sql = "CREATE TABLE cheesestest2(id INT, name varchar(20), price INT, name varchar(20))";
    console.log("Base de données connectée mysql")

    let sql = "CREATE TABLE cheesestest2(id INT, name varchar(20), price INT, description varchar(250), subtitle varchar(250), pound varchar(250), milk varchar(250), refining varchar(250), pate varchar(250), wine varchar(250), img varchar(250))";

      /*connexionMysql.query(sql, function(err, result){
          if(err) throw err;
          console.log("Table created");
      });*/
    
    /*let sql2 = "INSERT into cheesestest(name)values('Nat')";
    connexionMysql.query(sql2, function(err, result){
        if(err) throw err;
        console.log("1 entrée");
    });*/
  })



 // db.client.query("CREATE TABLE cheeses ( id serial PRIMARY KEY, name TEXT NOT NULL, price INT NOT NULL, description TEXT NOT NULL, subtitle VARCHAR NOT NULL, pound VARCHAR NOT NULL, milk VARCHAR NOT NULL, refining VARCHAR NOT NULL, pate VARCHAR NOT NULL, wine VARCHAR NOT NULL, img VARCHAR NOT NULL)");

  /*db.client.query("CREATE TABLE cheesestest (id INT ,name VARCHAR(250))", (err, res)=>{
    //console.log(err, res)
    db.client.end
  });*/
 

  //db.client.query("INSERT INTO cheeses (name, price, description, subtitle, pound, milk, refining, pate, wine  ) VALUES ('Test', 5, 'test description', 'short descr', '5grm', 'de vache', '1 an', 'molle', 'vin blanc' )");

  const browser = await puppeteer.launch(); // { headless: false }
  const page = await browser.newPage();



  await page.goto("https://www.fromages.com/fr/fromages/fromages-a-la-coupe");

  const cheesesUrl = await page.evaluate(() => {
    let cheeses = [];

    const lists = document.querySelectorAll(".fromage_liste_unit");

    for (const list of lists) {
      const url = list.querySelector(".fromage_liste_nom a").href;
      const category = list.querySelector(".fromage_liste_region").innerText;

      //console.log(category)
      cheeses.push(url, category);
    }

    return cheeses;
  });

  //console.log(cheesesUrl);

  let cheese = [];

  for (url of cheesesUrl) {
      //console.log(url);

      try {
    await page.goto(url);

    const results = await page.evaluate((db) => {
        //console.log(document.querySelector(".prix"))
            const name = document.querySelector(".fromage_detail_titre").innerText;
            //const name = "hhdhhdh";
            //const price = bloc.querySelector(".plateau_detail_prix > span").innerHTML;
   
            const price = document.querySelectorAll(".bloc_fromage_detail meta[itemprop='price']")[0].content;
            const description = document.querySelector('.fromage_detail_description').innerHTML;
            const subtitle = document.querySelector(".fromage_detail_soustitre").innerText;
            //const kgPrice = document.querySelector(".prixkilo").innerText;
            const pound = document.querySelector(".picto_poids > .fond-marron-clair > .font-bold").innerText;
            const milk = document.querySelector(".picto_lait > .fond-marron-clair > .color-blanc > .font-bold").innerText;
            const refining = document.querySelector(".picto_affinage > .fond-marron-clair > .font-bold").innerText;
            const pate = document.querySelector(".picto_pate > .fond-marron-clair > .color-blanc > .font-bold").innerText;
            const wine = document.querySelector(".fromage_detail_vins_liste").innerText;
            const img = document.querySelector(".owl-carousel-fromagedetail > .owl-stage-outer > .owl-stage > .owl-item > .item > .img-responsive").src;


            return {subtitle: subtitle, name: name, wine: wine, pate: pate, refining: refining, milk: milk, pound: pound, description: description, price: price, img: img};
    
            //db.client.query(`INSERT INTO cheeses (name, price, description, subtitle, pound, milk, refining, pate, wine  ) VALUES (${name}, ${price}, ${description}, ${subtitle}, ${pound}, ${milk}, ${refining}, ${pate}, ${wine} )`);

    });

    cheese.push(results)

    //console.log('test', typeof cheese.name);
    //console.log(cheese)

    for(fromage of cheese){

        const nameT = fromage.name;
        let sql2 = `INSERT into cheesestest(name)values('${fromage.img}')`;
        connexionMysql.query(`SELECT name FROM cheesestest WHERE name = "${fromage.img}"`), function(err, result, field){
            if(result.length === 0){
                connexionMysql.query(sql2, function(err, result){
                    if(err) throw err;
                    console.log("1 entrée");
                });
            }else{  
                console.log("1 Existant");
            }
        }


        //let sql2 = `INSERT into cheesestest(name)values('${fromage.name}')`;
        //let sql3 = `INSERT INTO cheesestest2 ("name", "price", "description", "subtitle", "pound", "milk", "refining", "pate", "wine", "img"  ) VALUES ("${fromage.name}", "${fromage.price}", "${fromage.description}", "${fromage.subtitle}", "${fromage.pound}", "${fromage.milk}", "${fromage.refining}", "${fromage.pate}", "${fromage.wine}" , "${fromage.img}")`;

        /*connexionMysql.query(sql2, function(err, result){
            if(err) throw err;
            console.log("1 entrée");
        });*/
      //console.log('test name ici', fromage.name);
      //db.client.query(`INSERT INTO cheesesTest(name)values("${fromage.name}")`);
      //db.client.query(`INSERT INTO cheeses ("name", "price", "description", "subtitle", "pound", "milk", "refining", "pate", "wine", "img"  ) VALUES ("${fromage.name}", "${fromage.price}", "${fromage.description}", "${fromage.subtitle}", "${fromage.pound}", "${fromage.milk}", "${fromage.refining}", "${fromage.pate}", "${fromage.wine}" , "${fromage.img}")`);
      //db.client.query("INSERT INTO cheeses (name, price, description, subtitle, pound, milk, refining, pate, wine, img  ) VALUES ('test', 5, 'dhjdhjjj', 'short descr', '5grm', 'de vache', '1 an', 'molle', 'vin blanc', 'url dhdhdfhdfhddfdh' )");

    }

    //console.log(results)
      } catch(e) {
          //console.log(e)
      }

  }

 

  await browser.close();
})();

//console.log(cheese);

/*
await page.goto(url);

      const single = await page.evaluate(() => {
        const name = document.querySelector(".fromage_detail_titre").innerText;
        const price = document.querySelector(".prix").innerText;
        const subtitle = document.querySelector(".fromage_detail_soustitre").innerText;
        const kgPrice = document.querySelector(".prixkilo").innerText;
        const pound = document.querySelector(".picto_poids").innerText;
        const milk = document.querySelector(".picto_lait").innerText;
        const pate = document.querySelector(".picto_pate").innerText;
        const wine = document.querySelector(".fromage_detail_vins_liste").innerText;

        fromages.push({ name: name, price: price, subtitle: subtitle, kgPrice: kgPrice, pound: pound, milk: milk, pate: pate, wine: wine });
 
*/