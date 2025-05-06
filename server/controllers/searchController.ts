import { Request, Response } from "express";
import { amazonSearch, amazonSearchById } from "./amazonController";
import Product from "../models/Product";
import { ebaySearch, eBaySearchById } from "./ebayController";
import { bestBuySearch, bestBuySearchById } from "./bestBuyController";
import { targetSearch } from "./targetController";
import { CommonSearchResults } from "../types/product";

// In-memory cache
const queryCache = new Map<
  string,
  { data: CommonSearchResults[]; timestamp: number }
>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

const calculateRelevanceScore = (
  keywords: Array<string>,
  itemTitle: string,
  averageItemPrice: number,
  itemPrice: number
) => {
  const titleKeywords = itemTitle.toLowerCase().split(" ");

  let score = 0;
  titleKeywords.forEach((word) => {
    if (keywords.includes(word)) {
      score++;
    }
  });

  const deviation = Math.abs(averageItemPrice - itemPrice) || 1;
  return score + 1 / deviation;
};

export const searchProduct = async (req: Request, res: Response) => {
  const { query, page, checkCache } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Search query is required." });
  }

  const keywords = query.toLowerCase().split(" ");
  const now = Date.now();

  if (checkCache as string == "true") {
    const cached = queryCache.get(query);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      console.log(`Serving cached results for "${query}"`);
      const avgPrice = cached.data.length
        ? cached.data.reduce((sum, r) => sum + r.product.price, 0) /
          cached.data.length
        : 1;

      const products = cached.data.map((result) => ({
        product: result.product,
        relevanceScore: calculateRelevanceScore(
          keywords,
          result.product.name,
          avgPrice,
          result.product.price
        ),
      }));

      return res.status(200).json({ results: products, partial: false });
    }
  }

  try {
    const [amazonResults, ebayResults, bestBuyResults] = await Promise.all([
      amazonSearch(query, parseInt(page as string)),
      ebaySearch({ q: query }, parseInt(page as string)),
      bestBuySearch(query),
      //targetSearch(query),
    ]);

    const allResults = [
      ...amazonResults,
      ...ebayResults,
      ...bestBuyResults,
      //...targetResults,
    ];

    const avgPrice = allResults.length
      ? allResults.reduce((sum, r) => sum + r.product.price, 0) /
        allResults.length
      : 1;

    const products = allResults.map((result) => ({
      product: result.product,
      relevanceScore: calculateRelevanceScore(
        keywords,
        result.product.name,
        avgPrice,
        result.product.price
      ),
    }));

    queryCache.set(query, { data: allResults, timestamp: now });

    res.status(200).json({ results: products, partial: false });
  } catch (err) {
    console.error("Error during search", err);
    res.status(500).json({ error: "An error occurred during search." });
  }
};

export const searchProductById = async (req: Request, res: Response) => {
  try {
    const query = req.params.id;

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Invalid ID parameter" });
      return;
    }

    const id = query.trim();
    console.log("Processing request for ID:", id);

    let results: CommonSearchResults;

    if (/^\d{7,9}$/.test(id)) {
      results = await bestBuySearchById(id);
    } else if (id.length === 10) {
      results = await amazonSearchById(id);
    } else {
      results = await eBaySearchById(id);
    }

    if (!results) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "An error occurred while searching." });
  }
};

export default searchProduct;
