const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('/html/body/div[1]/div[1]/div[2]/div/div/div/main/div/article/div/p[1]/a/img');
    const src = await el.getProperty('src');
    const srcTxt = await src.jsonValue();

    const [el2] = await page.$x('//*[@id="tablepl"]/tbody/tr[3]/td[2]');
    const txt = await el2.getProperty('textContent');
    const rawTxt = await txt.jsonValue();

    const [table] = await page.$x('//*[@id="tablepl"]/tbody');


    // console.log({srcTxt, rawTxt});
    console.log(table.tr[0]);

    browser.close();
}

scrapeProduct('https://meteomodel.pl/dane/historyczne-dane-pomiarowe');
