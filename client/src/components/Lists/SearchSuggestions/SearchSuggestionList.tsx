import React from "react";
import SearchSuggestionCard from "../../Cards/SearchSuggestionCard/SearchSuggestionCard";
import { SearchSuggestion } from "../../../types/SearchSuggestion";

interface SearchSuggestionListProps {
  suggestions: SearchSuggestion[];
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onSeeAllResults: () => void;
  searchQuery: string;
}

const SearchSuggestionList: React.FC<SearchSuggestionListProps> = ({
  suggestions,
  onSuggestionClick,
  onSeeAllResults,
  searchQuery,
}) => {
  // Ensure suggestions is always an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  return (
    <div className="bg-white rounded-lg shadow-lg border divide-y">
      <ul className="max-h-64 overflow-y-auto">
        {safeSuggestions.map((suggestion) => (
          <SearchSuggestionCard
            key={suggestion.keyword}
            suggestion={suggestion}
            onClick={onSuggestionClick}
          />
        ))}
      </ul>
      <div className="p-2">
        <button
          className="btn btn-accent text-black font-semibold w-full shadow-lg"
          onClick={onSeeAllResults}
        >
          See all results for "{searchQuery}"
        </button>
      </div>
    </div>
  );
};

export default SearchSuggestionList;
