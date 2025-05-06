import { Request, Response } from "express";
import SearchSuggestion from "../models/SearchSuggestion";

export const getSuggestions = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json([]);
  }

  try {
    console.log("Server received suggestion query:", query);
    
    // First try text search (which uses the text index)
    const textResults = await SearchSuggestion.find({
      $text: { $search: query }
    })
    .sort({ searchCount: -1, lastSearched: -1 })
    .limit(5)
    .select('keyword categories searchCount -_id');
    
    // If we have enough results, return them
    if (textResults.length >= 5) {
      console.log("Server returning text search results:", textResults);
      return res.status(200).json(textResults);
    }
    
    // Otherwise, try regex search separately
    const regexResults = await SearchSuggestion.find({
      $or: [
        // Regex for partial keyword matches (starts with)
        { keyword: { $regex: new RegExp(`^${query}`, 'i') } },
        // Match in related terms
        { relatedTerms: { $regex: new RegExp(query, 'i') } }
      ]
    })
    .sort({ searchCount: -1, lastSearched: -1 })
    .limit(5)
    .select('keyword categories searchCount -_id');
    
    // Combine results, avoiding duplicates
    const allResults = [...textResults];
    const existingKeywords = new Set(allResults.map(s => s.keyword));
    
    for (const result of regexResults) {
      if (!existingKeywords.has(result.keyword)) {
        allResults.push(result);
        existingKeywords.add(result.keyword);
        if (allResults.length >= 5) break;
      }
    }
    
    console.log("Server returning combined results:", allResults);
    res.status(200).json(allResults);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json([]);
  }
};

export const updateSearchStats = async (req: Request, res: Response) => {
  const { keyword } = req.body;

  try {
    await SearchSuggestion.findOneAndUpdate(
      { keyword: keyword.toLowerCase() },
      { 
        $inc: { searchCount: 1 },
        $set: { lastSearched: new Date() }
      },
      { upsert: true }
    );
    res.status(200).json({ message: "Search stats updated" });
  } catch (error) {
    console.error("Error updating search stats:", error);
    res.status(500).json({ error: "Failed to update search stats" });
  }
}; 