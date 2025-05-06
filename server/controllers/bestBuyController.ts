import puppeteer from "puppeteer";
import { CommonSearchResults } from "../types/product";

// Global variable to store search results
let searchResultsCache: CommonSearchResults[] = [];

export const bestBuySearch = async (query: string): Promise<CommonSearchResults[]> => {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']  
  });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'font') {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  const url = `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`;

  try {
    //console.log("Navigating to BestBuy...");
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });  
    //console.log("Page loaded successfully");

    await page.waitForSelector(".sku-item", { timeout: 15000 });

    const results: CommonSearchResults[] = await page.evaluate(() => {
      const items: CommonSearchResults[] = [];

      const productElements = document.querySelectorAll(".sku-item");
      productElements.forEach((el, i) => {
        if (i >= 3) return; 

        const nameAnchor = el.querySelector(".sku-title a");
        const name = nameAnchor?.textContent?.trim() || "Unnamed";  

        const link = nameAnchor?.href ?? "";
        const idMatch = link.match(/\/(\d{7,9})\.p/);
        const id = idMatch ? idMatch[1] : link; 

        
        const priceSpan = el.querySelector(".priceView-customer-price span");
        const priceRaw = priceSpan?.textContent ?? "";
        const price = priceRaw ? parseFloat(priceRaw.replace(/[^0-9.]/g, "")) : null;

        
        const imgElement = el.querySelector("img");
        const image =
          imgElement?.getAttribute("src") ||
          imgElement?.getAttribute("data-src") ||
          imgElement?.getAttribute("srcset")?.split(" ")[0] ||
          null;

        
        if (name !== "Unnamed" && link) {
          items.push({
            product: {
              _id: id,
              name,
              brand: name.split(" ")[0], // You may adjust this based on naming conventions
              platform: "Best Buy",
              condition: "New",
              price,
              imageURL: image,
              productUrl: link,
              priceHistory: [],
            },
          });
        }
      });

      return items;
    });

    
    searchResultsCache = results;

    //console.log("Extracted products:", results);
    browser.close();
    return results;
  } catch (err) {
    console.error("BestBuy error:", err);
    await browser.close();
    return [];
  }
};


export const bestBuySearchById = async (id: string): Promise<CommonSearchResults | null> => {
  
  const cachedResult = searchResultsCache.find(result => result.product._id === id);
  if (cachedResult) {
    console.log("Returning cached result for:", id);
    return cachedResult;
  }

  const url = id.startsWith("http") ? id : `https://www.bestbuy.com/site/${id}.p`;

  const scrape = async (): Promise<CommonSearchResults | null> => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    try {
      console.log("Navigating to BestBuy product page...");
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      await page.waitForFunction(() => {
        return (
          !!document.querySelector(".sku-title") &&
          !!document.querySelector(".priceView-customer-price span") &&
          !!document.querySelector("img")
        );
      }, { timeout: 15000 });

      const result: CommonSearchResults | null = await page.evaluate(() => {
        const name = document.querySelector(".sku-title")?.textContent?.trim() ?? null;
        const priceRaw = document.querySelector(".priceView-customer-price span")?.textContent ?? null;
        const imgElement = document.querySelector(".primary-image") || document.querySelector("img");
        const image =
          imgElement?.getAttribute("src") ||
          imgElement?.getAttribute("data-src") ||
          imgElement?.getAttribute("srcset")?.split(" ")[0] ||
          null;

        if (!name || !priceRaw || !image) return null;

        const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ""));

        return {
          product: {
            _id: id,
            name,
            brand: name.split(" ")[0],
            platform: "Best Buy",
            condition: "New",
            price,
            imageURL: image,
            productUrl: window.location.href,
            priceHistory: [],
          },
        };
      });

      browser.close();
      console.log("Product fetched from scrape:", result);
      return result;
    } catch (error) {
      console.error("Error scraping BestBuy product page:", error);
      await browser.close();
      return null;
    }
  };

  let finalResult: CommonSearchResults | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    finalResult = await scrape();
    if (finalResult) break;
    console.warn(`Attempt ${attempt + 1} failed. Retrying...`);
  }

  if (finalResult) {
    searchResultsCache.push(finalResult);  // Add to cache
  }

  return finalResult;
};
