const puppeteer = require("puppeteer");

async function scrapeAmazonProduct(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const product = await page.evaluate(() => {
    const selectText = (selector) => {
      const element = document.querySelector(selector);
      return element ? element.innerText.trim() : "";
    };

    const name = selectText("#productTitle");

     const priceWhole = document.querySelector('.a-price-whole')?.textContent;
     const priceFraction = document.querySelector('.a-price-fraction')?.textContent;
     const price = priceWhole || priceFraction ? `${priceWhole}${priceFraction}` : 'Price not available';


    const descriptionItems = Array.from(
      document.querySelectorAll(
        "#feature-bullets ul.a-unordered-list li span.a-list-item"
      )
    );
    const description = descriptionItems
      .map((item) => item.textContent.trim())
      .join(" ");

    return {
      name,
      price,
      description,
    };
  });

  await browser.close();

  return product;
}
