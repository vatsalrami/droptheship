const puppeteer = require("puppeteer");

async function scrapeAmazonProduct(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const product = await page.evaluate(() => {
    const selectText = (selector: string) => {
      const element = document.querySelector(selector);
      return element ? (element as HTMLElement).innerText.trim() : "";
    };

    const selectAttribute = (selector: string, attribute: string) => {
      const element = document.querySelector(selector);
      return element ? element.getAttribute(attribute) : "";
    };

    const name = selectText("#productTitle");

    const priceWhole = document.querySelector(".a-price-whole")?.textContent;
    const priceFraction =
      document.querySelector(".a-price-fraction")?.textContent;
    const price =
      priceWhole || priceFraction
        ? `${priceWhole}${priceFraction}`
        : "Price not available";

    const descriptionItems = Array.from(
      document.querySelectorAll(
        "#feature-bullets ul.a-unordered-list li span.a-list-item"
      )
    );
    const description = descriptionItems
      .map((item) => (item as HTMLElement).textContent?.trim() || "")
      .join(" ");

    const imageUrl = selectAttribute("#landingImage", "src");

    return {
      name,
      price,
      description,
      imageUrl,
    };
  });

  await browser.close();

  return product;
}

export { scrapeAmazonProduct };
