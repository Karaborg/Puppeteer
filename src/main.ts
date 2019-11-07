import { link } from 'fs';

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let gameURLs: string[] = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // List of Games
  let alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; 
  for (let i = 0; i < alphabet.length; i++) {
    let varning = 0;
    for (let j = 1; ; j++) {
      await page.goto('https://apps.apple.com/us/genre/ios-games/id6014?letter=' + alphabet[i] + '&page=' + j + '#page');
      const innerText = await page.evaluate(() => document.querySelector('#selectedcontent').innerText);
      const innerTextLength = await page.evaluate(() => document.querySelector('#selectedcontent').innerText.length);
      if(innerTextLength <= 100){
        varning++
      }
      if(varning <= 1){
        //console.log(innerText)
        listOfGameLinks(page)
      }else{
        break
      }
    }
  }
  await browser.close();
})();

async function listOfGameLinks(page) {
  // Get All href
  const hrefs1 = await page.evaluate(
    () => Array.from(
     document.querySelectorAll('a[href]'),
     a => a.getAttribute('href')
    )
  );

  // Save App Links in Array
  for (let i = 0; i < hrefs1.length; i++) {
    var string = hrefs1[i],
    substring = 'https://apps.apple.com/us/app/'
    if (string.includes(substring)) {
      gameURLs.push(hrefs1[i])
      //console.log(hrefs1[i])
    }
  }
  console.log(gameURLs)
  return gameURLs;
}