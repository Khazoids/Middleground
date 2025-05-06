import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchProducts } from "../../services/SearchService";
import SearchResultCard from "../Cards/SearchResultCard/SearchResultCard";
import { SearchResult } from "../../types/Search";
import { addRecentSearch } from "../../services/RecentSearchesService";
// Add type for sort options
type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "relevance";

const PAGE_SIZE = 10;

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [checkedCards, setCheckedCards] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  // Function to sort results
  const getSortedResults = (results: SearchResult[], sortBy: SortOption) => {
    // Filter and convert results to ensure all have a valid product property
    const validResults = results.filter((result) => {
      // Handle direct properties (debug mode format)
      if (result._id !== undefined && !result.product) {
        // Convert to expected format
        result.product = {
          _id: result._id as string,
          name: result.name || "",
          platform: result.platform || "",
          price: result.price || 0,
          imageURL: result.imageURL || null,
        };
        return true;
      }
      // Handle normal format
      return result && result.product;
    });

    const sortedResults = [...validResults];

    switch (sortBy) {
      case "price-asc":
        return sortedResults.sort(
          (a, b) => (a.product.price || 0) - (b.product.price || 0)
        );
      case "price-desc":
        return sortedResults.sort(
          (a, b) => (b.product.price || 0) - (a.product.price || 0)
        );
      case "name-asc":
        return sortedResults.sort((a, b) =>
          a.product.name.localeCompare(b.product.name)
        );
      case "name-desc":
        return sortedResults.sort((a, b) =>
          b.product.name.localeCompare(a.product.name)
        );
      case "relevance":
        return sortedResults.sort(
          (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
        );
      default:
        return sortedResults;
    }
  };

  // Navigate to ProductDetails page
  const navigateProductDetails = (searchResult: SearchResult) => {
    addRecentSearch({ ...searchResult, searchedAt: new Date() });
    navigate(`/product/${searchResult.product._id}`, {
      state: results || [], // need the OR check otherwise the app throws an uncontrolled component warning
    });
  };

  const navigateProductComparisons = () => {
    navigate(`/product/${checkedCards[0].product._id}`, {
      state: checkedCards,
    });
  };

  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    // Update URL params
    setSearchParams((prev) => {
      prev.set("sort", newSort);
      return prev;
    });
  };

  // Handle SearchResult card's checkbox events
  const handleCardCheckChanged = (card: SearchResult, isChecked: boolean) => {
    if (isChecked) {
      setCheckedCards([...checkedCards, card]);
    } else {
      const filteredCards = checkedCards.filter((c) => {
        c.product._id === card.product._id;
      });
      setCheckedCards(filteredCards);
    }
  };

  const fetchResults = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      console.log("Searching with page number: " + currentPage);
      console.log("Query: " + query);
      const { results: fetchedResults = [] } = await searchProducts(
        query,
        currentPage,
        currentPage == 1 ? "true" : "false"
      );
      console.log(fetchedResults);
      setResults(fetchedResults);

      //const searchResults = await searchProducts(query);
      // console.log("Search results:", searchResults);
      //setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to fetch results");
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query, currentPage]);

  // Get sorted results
  const sortedResults = getSortedResults(results, sortBy);

  const ITEMS_PER_PAGE = 10;
  // Add a function to handle pagination
  const totalPages = results ? Math.ceil(results.length / ITEMS_PER_PAGE) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination UI component - updated styling to match other buttons on the page
  const Pagination = () => {
    return (
      <div className="flex justify-center items-center gap-2 mb-3">
        <button
          className="btn btn-sm btn-accent text-black"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`btn btn-sm ${
              currentPage === i + 1
                ? "btn-accent text-black"
                : "btn-outline hover:btn-accent hover:text-black"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-sm btn-accent text-black"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with Sort */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <h1 className="text-2xl text-black font-bold w-full">
              Search Results
            </h1>
            {results.length > 0 && (
              <div className="flex items-center justify-end gap-2 w-full">
                <div className="w-full flex items-center justify-end">
                  <span className="text-sm text-gray-500 mx-8">Sort By:</span>
                  <select
                    className="select select-bordered select-md grow"
                    value={sortBy}
                    onChange={(e) =>
                      handleSortChange(e.target.value as SortOption)
                    }
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex">
            {isLoading ? (
              <p className="text-base-content/70 grow">Searching...</p>
            ) : (
              <p className="text-base-content/70 grow">
                Showing {Math.min(results.length, 10)} of {results.length}{" "}
                results for "{query}"
              </p>
            )}

            <button
              className="btn btn-accent"
              disabled={!(checkedCards.length >= 1)}
              onClick={() => navigateProductComparisons()}
            >
              Compare
            </button>
          </div>
        </div>

        {/* Results Content */}
        {isLoading ? (
          // Loading State
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card bg-white animate-pulse">
                <div className="card-body">
                  <div className="flex gap-6">
                    <div className="w-48 h-48 bg-white rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-white rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-white rounded w-1/2 mb-6"></div>
                      <div className="h-8 bg-white rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-8">
            <p className="text-error mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : sortedResults.length > 0 ? (
          // Results List
          <div className="space-y-4">
            {sortedResults.slice(0, ITEMS_PER_PAGE).map((result) => {
              // Make sure we have a valid product object
              const product = result.product || {
                _id: result._id as string,
                name: result.name || "",
                platform: result.platform || "",
                price: result.price || 0,
                imageURL: result.imageURL || null,
              };

              const searchResult = {
                ...result,
                product,
              };

              return (
                <SearchResultCard
                  key={product._id}
                  result={searchResult}
                  defaultChecked={false}
                  onClick={navigateProductDetails}
                  checkChanged={handleCardCheckChanged}
                />
              );
            })}
          </div>
        ) : (
          // No Results State
          <div className="text-center py-8">
            <p className="text-lg">No results found for "{query}"</p>
            <p className="text-base-content/70 mt-2">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
      <div className="mt-8">
        <Pagination />
      </div>
    </div>
  );
};

export default SearchResults;
