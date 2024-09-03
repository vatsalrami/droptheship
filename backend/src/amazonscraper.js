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

const url =
  "https://www.amazon.com/Adhesive-Upgraded-Management-Christmas-Ethernet/dp/B08ZJF9W33/ref=sr_1_8?crid=2CA7ABRPQ6EYY&dib=eyJ2IjoiMSJ9.npjnPy6Ci1pOcQh7mmKq4PwJkm-7uNFJRmPHIW27qLgR4ecL9D3XgTanZFyNM5yg90JL-xBvtV2qapeX-xOWM2SZJQRPkXzapIBFTO0sd_Kl6fvMDLlM0bYIjDnmoo49LM94bxP3gsYKY-wcKdk8oQfU5lP4k_YuCU6gS4Yz5BYD0YII6la-hpUzmkcnMjdMUW0nLwAgfI_h344M7su6k_nman6MGYOAR5hvKAETJDM.gpQdjYdPsDMuEO3Gpq7xo6q5IfB_qBAJwCgU7_rdkoE&dib_tag=se&keywords=cable%2Bmanagement&qid=1725385294&sprefix=cable%2B%2Caps%2C75&sr=8-8&th=1";
scrapeAmazonProduct(url)
  .then((product) => console.log(product))
  .catch((error) => console.error("Error scraping Amazon product:", error));
