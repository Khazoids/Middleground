import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    watchlist: [
      {
        name: String,
        price: Number,
        vendor: String,
        picture: String,
        isNotified: Boolean,
        priceChange: Number,
        usePriceLimit: Boolean,
        priceChangePeriod: Number,
        id:  {  // ASIN for Amazon products
            type: String,
            sparse: true  // Allows null/undefined values
          },
        priceHistory: [
            {
            price: Number
            }
        ]
      },
    ],
  });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
