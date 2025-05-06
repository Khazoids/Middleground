import mongoose from "mongoose";

const searchSuggestionSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  searchCount: {
    type: Number,
    default: 1
  },
  lastSearched: {
    type: Date,
    default: Date.now
  },
  categories: [{
    type: String,
    trim: true
  }],
  relatedTerms: [{
    type: String,
    trim: true
  }]
});

// Index for text search
searchSuggestionSchema.index({ 
  keyword: 'text',
  categories: 'text',
  relatedTerms: 'text'
}, {
  weights: {
    keyword: 10,
    categories: 5,
    relatedTerms: 3
  }
});

const SearchSuggestion = mongoose.model("SearchSuggestion", searchSuggestionSchema);

export default SearchSuggestion; 