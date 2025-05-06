// import { amazonSearch } from "./amazonController";
// import { ebaySearch } from "./ebayController";
// import { bestBuySearch } from "./bestBuyController";
// import { targetSearch } from "./targetController";
// import { CommonSearchResults } from "../types/product";

// type ScraperFunction = (query: string) => Promise<CommonSearchResults[]>;

// export const fastScrapers: ScraperFunction[] = [
// //   amazonSearch,
//     bestBuySearch,  
//    //targetSearch,
//   (query: string) => ebaySearch({ q: query }), // wrap to match signature
// ];

// export const slowScrapers: ScraperFunction[] = [
// //   bestBuySearch,
// ];

// export const runFastScrapers = async (query: string) => {
//   const results = await Promise.all(fastScrapers.map(scraper => scraper(query)));
//   return results.flat();
// };

// export const runSlowScrapers = async (query: string) => {
//   const results = await Promise.all(slowScrapers.map(scraper => scraper(query)));
//   return results.flat();
// };
