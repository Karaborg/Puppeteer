import { link } from 'fs';

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

/**
 * Some predefined delays (in milliseconds).
 */
export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - Number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(
  name: string,
  delay: number = Delays.Medium,
): Promise<string> {
  console.log("HERE")
  return new Promise((resolve: (value?: string) => void) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay),
  );
}

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

// Below are examples of using TSLint errors suppression
// Here it is suppressing missing type definitions for greeter function

// tslint:disable-next-line typedef
export async function greeter(name) {
  // tslint:disable-next-line no-unsafe-any no-return-await
  return await delayedHello(name, Delays.Long);
}