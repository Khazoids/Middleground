import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";
import Watchlist from "../models/Watchlist.js";

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/watchlist', async (req, res) => {
    const { email, item } = req.body;
    console.log("hi1");
  
    try {
      let userWatchlist = await Watchlist.findOne({ email });
  
      if (!userWatchlist) {
        // If user does not exist, create a new entry
        userWatchlist = new Watchlist({ email, watchlist: [item] });
      } else {
        const existingItem = userWatchlist.watchlist.find((temp) => temp.name === item.name);

        if (existingItem) {
            return res.status(400).json({ error: 'ASIN already exists in your watchlist.' });
         }
        // Add the new item to the user's existing watchlist
        userWatchlist.watchlist.push(item);
      }
  
      await userWatchlist.save();
      res.status(200).json({ message: 'Item added to watchlist' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add item to watchlist' });
    }
  });




router.get("/watchlist", async (req, res) => {
    const { email } = req.query;
  
    try {
      const userWatchlist = await Watchlist.findOne({ email });
  
      if (!userWatchlist || !Array.isArray(userWatchlist.watchlist) || userWatchlist.watchlist.length === 0) {
        return res.status(404).json({ message: "Watchlist not found for this email", watchlist: [] });
      }
  
      //console.log("Fetched user watchlist:", userWatchlist.watchlist);
  
      // Convert Mongoose document to plain JavaScript object
      const updatedWatchlist = userWatchlist.watchlist.map((item) => {
        const plainItem = item.toObject(); // Convert to plain object
  
        if (!plainItem.priceHistory || plainItem.priceHistory.length === 0) {
          return { ...plainItem, priceChange: null };
        }
  
        const latestPrice = plainItem.priceHistory[plainItem.priceHistory.length - 1]?.price || 0;
  
        // Find the past price (7 days ago OR the oldest price)
        const pastPrice =
          plainItem.priceHistory.length < 8
            ? plainItem.priceHistory[0]?.price
            : plainItem.priceHistory[plainItem.priceHistory.length - 8]?.price;
  
        if (pastPrice === undefined) {
          return { ...plainItem, priceChange: null }; // Avoid NaN errors
        }
  
        const newPriceChange = ((latestPrice - pastPrice) / pastPrice) * 100;
        return { ...plainItem, priceChange: newPriceChange,isNotified: plainItem.isNotified || false,
          usePriceLimit: plainItem.usePriceLimit || false,
          priceChangePeriod: plainItem.priceChangePeriod || 7, };
      });
  
      //console.log("Updated Watchlist:", updatedWatchlist);
  
      res.status(200).json({ watchlist: updatedWatchlist });
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });
  
// 
  
// Example backend route for deleting an item
router.delete("/watchlist/delete", async (req, res) => {
    const { email, itemName } = req.body; // Pass the user's email and item name to identify the item
  
    try {
      const user = await Watchlist.findOneAndUpdate(
        { email },
        { $pull: { watchlist: { name: itemName } } }, // Remove the item with the matching name
        { new: true } // Return the updated document
      );
  
      if (user) {
        res.status(200).json({ message: "Item deleted successfully", watchlist: user.watchlist });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  router.put("/watchlist/notify", async (req, res) => {
    const { email, itemName, isNotified, priceChange, usePriceLimit } = req.body;
    try {
      const user = await Watchlist.findOneAndUpdate(
        { email, "watchlist.name": itemName },
        { 
          $set: { 
            "watchlist.$.isNotified": isNotified,
            "watchlist.$.priceChange": priceChange,
            "watchlist.$.usePriceLimit": usePriceLimit
             // Added priceChange field
          } 
        },
        { new: true }
      );
  
      if (user) {
        res.status(200).json({ message: "Notification status and price change updated", watchlist: user.watchlist });
      } else {
        res.status(404).json({ error: "User or item not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update notification status and price change" });
    }
  });
  
  router.put("/watchlist/period", async (req, res) => {
    const { email, itemName, priceChangePeriod } = req.body;
  
    try {
      const user = await Watchlist.findOneAndUpdate(
        { email, "watchlist.name": itemName },
        { 
          $set: { 
            "watchlist.$.priceChangePeriod": priceChangePeriod
          } 
        },
        { new: true }
      );
  
      if (user) {
        res.status(200).json({ 
          message: "Price monitoring period updated", 
          watchlist: user.watchlist 
        });
      } else {
        res.status(404).json({ error: "User or item not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        error: "Failed to update price monitoring period" 
      });
    }
  });
  

export default router;