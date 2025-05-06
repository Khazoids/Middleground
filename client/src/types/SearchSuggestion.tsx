export interface SearchSuggestion {
  keyword: string;
  searchCount: number;
  lastSearched: Date;
  categories?: string[];
  relatedTerms?: string[];
}
