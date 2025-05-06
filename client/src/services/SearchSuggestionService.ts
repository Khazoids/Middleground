import axios from 'axios';
import { SearchSuggestion } from '../types/SearchSuggestion';

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

export const getSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/search/suggestions?query=${encodeURIComponent(query)}`
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Suggestion error:", error);
    return [];
  }
};

export const updateSearchStats = async (keyword: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/search/stats`, { keyword });
  } catch (error) {
    console.error("Error updating search stats:", error);
  }
}; 