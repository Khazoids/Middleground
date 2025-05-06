import puppeteer from "puppeteer";
import { CommonSearchResults } from "../types/product"; // Import type if needed

export const targetSearch = async (query: string): Promise<CommonSearchResults[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to Target's search page
  const searchURL = `https://www.target.com/s?searchTerm=${encodeURIComponent(query)}`;

  try {
    console.log('Navigating to Target...');
    await page.goto(searchURL, { waitUntil: "networkidle2", timeout: 60000 });
    console.log('Page loaded successfully');

    // Wait for product elements to render
    await page.waitForSelector('[data-test="product-title"]', { timeout: 60000 });

    const results: CommonSearchResults[] = await page.evaluate(() => {
      const items: CommonSearchResults[] = [];
      const productCards = document.querySelectorAll('[data-test="product-title"]');

      productCards.forEach((card, index) => {
        if (index >= 3) return; // Limit to the first 3 products

        const title = card.innerText.trim();
        const container = card.closest('a[href]');
        const link = container?.href || 'No Link Found';
        const priceSpan = container?.querySelector('[data-test="current-price"] span');
        const priceRaw = priceSpan?.innerText.trim() || 'No Price Found';
        const price = parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || null;
        
        // Get image URL (adjust selector as needed)
        const imgElement = container?.querySelector('img');
        const image = imgElement?.getAttribute('src') || null;

        if (title !== 'No Link Found' && link !== 'No Link Found') {
          items.push({
            product: {
              _id: link, // Use the link as the ID
              name: title,
              brand: title.split(" ")[0], // Basic brand extraction
              platform: "Target",
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

    console.log('Extracted products:', results);
    await browser.close();
    return results;
  } catch (error) {
    console.error("Error during Target search:", error);
    await browser.close();
    return [];
  }
};
