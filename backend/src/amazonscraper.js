const puppeteer = require('puppeteer');

async function scrapeAmazonProduct(url) {

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();


    await page.goto(url, { waitUntil: 'domcontentloaded' });

   
    const product = await page.evaluate(() => {
       
        const selectText = (selector) => {
            const element = document.querySelector(selector);
            return element ? element.innerText.trim() : '';
        };


        const name = selectText('#productTitle');
        const price = selectText('#a-price-whole').append('.').append('selectText('#a-price-whole')')
        const description = selectText('#productDescription p') || selectText('#feature-bullets ul');

        return {
            name,
            price,
            description,
        };
    });

    // Close the browser
    await browser.close();

    return product;
}

// Example usage
const url = 'https://www.amazon.com/dp/B09G3HRMVB'; // Replace with the Amazon product URL
scrapeAmazonProduct(url)
    .then(product => console.log(product))
    .catch(error => console.error('Error scraping Amazon product:', error));
