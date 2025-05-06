import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBarResultCard from "../../Cards/SearchBarResultCard/SearchBarResultCard";
import SearchSuggestionList from "../../Lists/SearchSuggestions/SearchSuggestionList";
import { SearchResult } from "../../../types/SearchResult";
import { SearchSuggestion } from "../../../types/SearchSuggestion";
import { searchProducts } from "../../../services/SearchService";
import {
  getSuggestions,
  updateSearchStats,
} from "../../../services/SearchSuggestionService";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search an item, or enter an item ID",
  onSearch,
  className = "",
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Use a ref to store the timeout ID between renders
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleSuggestions = async (value: string) => {
    if (value.length >= 2) {
      try {
        setIsLoading(true);
        const suggestionResults = await getSuggestions(value);
        console.log("Suggestion results:", suggestionResults);

        // If we got suggestions from the database, use them
        if (suggestionResults.length > 0) {
          setSuggestions(suggestionResults);
        }
        // If no suggestions found, add the current query as a suggestion
        else {
          setSuggestions([
            {
              keyword: value,
              searchCount: 0,
              lastSearched: new Date(),
              categories: [],
            },
          ]);
        }

        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    setQuery(suggestion.keyword);
    await updateSearchStats(suggestion.keyword);
    navigate(`/search?q=${encodeURIComponent(suggestion.keyword)}`);
    setShowSuggestions(false);
  };

  // Debounced suggestion function
  const debouncedSuggestions = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleSuggestions(value);
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSuggestions(value);
  };

  // Cancels the search if the user clicks outside of the focus after typing
  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200); // Small delay to allow click events to register
  };

  // Clean up timeout on component unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Update search stats when user submits a search
      updateSearchStats(query.trim());
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="input input-bordered w-full pr-10 focus:outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          ></button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && query.length >= 2 && (
        <div
          className="absolute z-10 w-full mt-2 bg-white shadow-lg border rounded-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          {isLoading ? (
            <div className="h-24 p-4 text-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : suggestions.length > 0 ? (
            <SearchSuggestionList
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              onSeeAllResults={() => {
                navigate(`/search?q=${encodeURIComponent(query)}`);
                setShowSuggestions(false);
              }}
              searchQuery={query}
            />
          ) : (
            <div className="p-4 text-center text-base-content/70">
              <p>No suggestions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
