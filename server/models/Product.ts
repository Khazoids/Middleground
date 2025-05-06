import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ['amazon', 'ebay', 'walmart'], // Add other retailers as needed
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    _id: { // ASIN or ISBN for amazon products. Amazon products should always have one or the other according to their documentation.
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      trim: true
    },
    imageURL: {
      type: String,
      required: true,
    },
    // retailer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Retailer",
    //   required: true,
    // },
    price: {  // Current price
      type: Number,
      required: true,
    },
    priceHistory: [priceHistorySchema],
    searchTerms: [{  // Add search terms array
      type: String,
      lowercase: true,
      trim: true
    }]
  },
  { timestamps: true }
);

productSchema.index({ 
  name: 'text', 
  brand: 'text', 
  searchTerms: 'text' 
}, {
  weights: {
    name: 5,      // Name matches are most important
    brand: 3,      // Brand matches are next
    searchTerms: 10 // Search term matches are least important
  },
  default_language: 'english'
});

const Product = mongoose.model("Product", productSchema);

export default Product;
