import React from "react";
import { SearchSuggestion } from "../../../types/SearchSuggestion";

interface SearchSuggestionCardProps {
  suggestion: SearchSuggestion;
  onClick: (suggestion: SearchSuggestion) => void;
}

const SearchSuggestionCard: React.FC<SearchSuggestionCardProps> = ({
  suggestion,
  onClick,
}) => {
  return (
    <li
      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
      onClick={() => onClick(suggestion)}
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 text-left">
          {suggestion.keyword}
        </p>
        {suggestion.categories && suggestion.categories.length > 0 && (
          <p className="text-xs text-gray-500 text-left">
            in {suggestion.categories.join(", ")}
          </p>
        )}
      </div>
      {suggestion.searchCount > 0 && (
        <span className="text-xs text-gray-400">
          {suggestion.searchCount} searches
        </span>
      )}
    </li>
  );
};

export default SearchSuggestionCard;
