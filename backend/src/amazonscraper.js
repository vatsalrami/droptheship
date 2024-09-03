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

    const selectAttribute = (selector, attribute) => {
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
      .map((item) => item.textContent.trim())
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

const url =
  "https://www.amazon.com/Adhesive-Upgraded-Holder-Organizer-Management/dp/B0BXL8BFYV/ref=sims_dp_d_dex_ai_speed_loc_mtl_v5_t1_d_sccl_3_2/141-9990932-4423218?pd_rd_w=O3IH1&content-id=amzn1.sym.da3a5e11-8f5f-413b-a68b-31ceac43c758&pf_rd_p=da3a5e11-8f5f-413b-a68b-31ceac43c758&pf_rd_r=PS4XMPVC3TD0236E60R2&pd_rd_wg=PFvQe&pd_rd_r=bb012942-2f3e-45ca-86c9-c43fda1216d9&pd_rd_i=B0BXL8BFYV&psc=1";
scrapeAmazonProduct(url)
  .then((product) => console.log(product))
  .catch((error) => console.error("Error scraping Amazon product:", error));
