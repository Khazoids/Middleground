import { RecentSearch } from '../types/Search';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 3;

export const getRecentSearches = (): RecentSearch[] => {
  const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
  const parsedSearches = searches ? JSON.parse(searches) : [];
  
  // Filter out invalid searches
  return parsedSearches.filter(search => search && search.product);
};

export const addRecentSearch = (search: RecentSearch) => {
  const searches = getRecentSearches();
  
  // Remove duplicate if exists
  const filteredSearches = searches.filter(s => s.product._id !== search.product._id);
  
  // Add new search to beginning
  const updatedSearches = [search, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
  
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
}; 