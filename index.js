const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch(); // { headless: false }
  const page = await browser.newPage();

  await page.goto("https://www.fromages.com/fr/fromages/fromages-a-la-coupe");

  const cheesesUrl = await page.evaluate(() => {
    let cheeses = [];

    const lists = document.querySelectorAll(".fromage_liste_unit");

    for (const list of lists) {
      const url = list.querySelector(".fromage_liste_nom a").href;
      cheeses.push(url);
    }

    return cheeses;
  });

  //console.log(cheesesUrl);

  let cheese = [];

  for (url of cheesesUrl) {
      console.log(url);

      try {
    await page.goto(url);

    const results = await page.evaluate(() => {
        //console.log(document.querySelector(".prix"))
            const name = document.querySelector(".fromage_detail_titre").innerText;
            //const price = bloc.querySelector(".plateau_detail_prix > span").innerHTML;
   
            const test = document.querySelectorAll(".bloc_fromage_detail meta[itemprop='price']")[0].content;
            const description = document.querySelector('.fromage_detail_description').innerHTML;
            const subtitle = document.querySelector(".fromage_detail_soustitre").innerText;
            //const kgPrice = document.querySelector(".prixkilo").innerText;
            const pound = document.querySelector(".picto_poids > .fond-marron-clair > .font-bold").innerText;
            const milk = document.querySelector(".picto_lait > .fond-marron-clair > .color-blanc > .font-bold").innerText;
            const affinage = document.querySelector(".picto_affinage > .fond-marron-clair > .font-bold").innerText;
            const pate = document.querySelector(".picto_pate > .fond-marron-clair > .color-blanc > .font-bold").innerText;
            const wine = document.querySelector(".fromage_detail_vins_liste").innerText;


            return {subtitle: subtitle, name: name, wine: wine, pate: pate, affinage: affinage, milk: milk, pound: pound, description: description, test: test};
    
            //return { name: name, price: price, subtitle: subtitle, kgPrice: kgPrice, pound: pound, milk: milk, pate: pate, wine: wine };
    });

    cheese.push(results)
    console.log(results)
      } catch(e) {
          //console.log(e)
      }

  }

  console.log(cheese)

  await browser.close();
})();

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