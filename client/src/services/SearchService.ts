import axios from 'axios';
import { SearchResult } from '../types/Search';

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

export const searchProducts = async (query: string, page: number, checkCache : string): Promise<SearchResult[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/search?query=${encodeURIComponent(query)}&page=${page}&checkCache=${checkCache}`
    );

    if (response.data) {
      // console.log('API Response:', response.data);
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Search error details:', error);
    return [];
  }
};

export const searchProductById = async (asin: string): Promise<SearchResult | null> => {
  try {
    const response = await axios.get(`${API_URL}/search/${asin}`);
    
    if (response.data && response.data.product) {
      //console.log('API Response:', response.data);
      return response.data;
    }
    console.error('Invalid response data structure:', response.data);
    return null;
  } catch (error) {
    console.error('Search error details:', error);
    return null;
  }
};
