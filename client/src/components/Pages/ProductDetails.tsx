import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { searchProductById } from "../../services/SearchService";
import { SearchResult } from "../../types/Search";
import VendorCard from "../Cards/VendorCard";
import axios from "axios";
import NotificationToast from "./NotificationToast";
import ProductDetailsGraph from "../Graphs/ProductDetailsGraph/ProductDetailsGraph";
import { GraphType } from "../../types/Graph";
import SearchResultCard from "../Cards/SearchResultCard/SearchResultCard";

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

const ITEMS_PER_PAGE_FILTER = [10, 25, 50, 100];

interface ComparisonCard extends SearchResult {
  isChecked: boolean;
}
const ProductDetails: React.FC = () => {
  // Get id from URL parameters
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_FILTER[0]);
  const [result, setResult] = useState<SearchResult>();
  // const [similarProducts, setSimilarProducts] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 5; // Fixed number of items per page

  // Modified initialization to only check first page items and ensure current item is checked
  const [comparisonCards, setComparisonCards] = useState<ComparisonCard[]>(
    location.state
      ? location.state.map((state: SearchResult, index: number) => ({
          ...state,
          isChecked: index < ITEMS_PER_PAGE || state.product._id === id, // Check first page items and current item
        }))
      : null
  );

  const [isProductChecked, setIsProductChecked] = useState<boolean>(true);
  const [isSellerChecked, setIsSellerChecked] = useState<boolean>(true);

  // Add a cache for similar items
  const [cachedItems, setCachedItems] = useState<Map<string, SearchResult>>(
    new Map()
  );

  // Remove itemsPerPage and add pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Handle SearchResult card's checkbox events
  const handleCardCheckChanged = (card: SearchResult, isChecked: boolean) => {
    if (isChecked) {
      const cards = comparisonCards.map((c) => {
        return c.product._id === card.product._id
          ? { ...c, isChecked: true }
          : c;
      });
      setComparisonCards(cards);
    } else {
      const cards = comparisonCards.map((c) => {
        return c.product._id === card.product._id
          ? { ...c, isChecked: false }
          : c;
      });
      setComparisonCards(cards);
    }
  };

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      3000
    );
  };
  const handleWatchClick = async () => {
    const email = localStorage.getItem("userEmail"); // Replace with user's actual email
    if (email == null) {
      showNotification("Not logged in", "error");
      return;
    }
    try {
      const item = {
        name: result!.product.name,
        price: result!.product.price,
        vendor: result!.product.platform,
        picture: result!.product.imageURL,
        priceChange: 0,
        isNotified: false,
        id: id,
        priceHistory: [{ price: result!.product.price }],
      };

      const response = await axios.post(`${API_URL}/watchlist/watchlist`, {
        email: email,
        item: item,
      });

      showNotification("Item added to watchlist!", "success");
    } catch (error: any) {
      console.error("Error:", error);
      showNotification("Item already in watchlist", "error");
    }
  };

  // Handle clicking on a search result card
  const handleCardClick = (searchResult: SearchResult) => {
    // Navigate to the product page
    if (searchResult.product && searchResult.product._id) {
      handleSimilarItemClick(searchResult.product._id);
    }
  };

  // Handle clicking on a similar item in the bar chart or card
  const handleSimilarItemClick = async (productId: string) => {
    if (!productId) {
      console.error("Invalid product ID");
      return;
    }

    setIsLoading(true);

    try {
      // Check if the item is already in our cache
      if (cachedItems.has(productId)) {
        // Use the cached item
        const cachedItem = cachedItems.get(productId);
        // Validate cached item has required properties
        if (cachedItem?.product) {
          navigate(`/product/${productId}`, {
            state: Array.from(cachedItems.values()).filter(
              (item) => item?.product
            ), // Filter out invalid items
          });
        } else {
          throw new Error("Cached item is invalid");
        }
      } else {
        // Fetch the item if not cached
        const searchResults = await searchProductById(productId);

        if (searchResults && searchResults.product) {
          // Add to cache
          const newCache = new Map(cachedItems);
          newCache.set(productId, searchResults);
          setCachedItems(newCache);

          // Navigate to the product page
          navigate(`/product/${productId}`, {
            state: Array.from(newCache.values()).filter(
              (item) => item?.product
            ), // Filter out invalid items
          });
        } else {
          setError("Failed to load product details - invalid data received");
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setError("Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError("No Item ID provided");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const cleanId = String(id).trim();
        const searchResults = await searchProductById(cleanId);

        if (!searchResults || !searchResults.product) {
          setError("Product not found or invalid data received");
          return;
        }

        setResult(searchResults);

        // Cache the current product
        const newCache = new Map(cachedItems);
        newCache.set(cleanId, searchResults);
        setCachedItems(newCache);

        // If we have comparison products from navigation state, cache them too
        if (location.state && Array.isArray(location.state)) {
          location.state.forEach((item: SearchResult) => {
            if (item && item.product && item.product._id) {
              newCache.set(item.product._id, item);
            }
          });
          setCachedItems(newCache);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Add a function to handle pagination
  const totalPages = comparisonCards
    ? Math.ceil(comparisonCards.length / ITEMS_PER_PAGE)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get current page items
  const getCurrentPageItems = () => {
    if (!comparisonCards) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return comparisonCards.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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

  // Render loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Render error state when there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">{error}</h2>
          <p className="text-black">
            Please try again later or check the product ID
          </p>
        </div>
      </div>
    );
  }

  // Add safety check to ensure result and result.product exist
  if (!result || !result.product) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">
            Invalid Product Data
          </h2>
          <p className="text-black">The product data is missing or invalid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex container mx-auto p-4">
      {notification.show && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}
      {/* Product Info Card */}
      <div className="basis-2/12">
        <div className="card card-compact bg-white w-full shadow-lg h-fit">
          <figure className="p-0">
            <img
              src={result.product.imageURL || "/placeholder-image.jpg"}
              alt={result.product.name}
              className="size-full rounded-t-xl object-cover"
            />
          </figure>
          <div className="join join-vertical bg-base-100">
            <div className="collapse collapse-arrow join-item border-base-300 border ">
              <input
                type="checkbox"
                name="product-details"
                checked={isProductChecked}
              />
              <div
                className="collapse-title font-semibold"
                onClick={() => setIsProductChecked(!isProductChecked)}
              >
                Product Details
              </div>
              <div className="collapse-content text-sm">
                <div className="space-y-2 divide-y divide-gray-200">
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Brand:</span>
                    <span>{result.product.brand}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Platform Origin:</span>
                    <span>{result.product.platform}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Item ID:</span>
                    <span>
                      {result.product.platform === "Amazon"
                        ? result.product._id
                        : result.product._id.split("|")[1]}
                    </span>
                  </div>
                  {result.product.price && (
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Price:</span>
                      <span className="text-lg font-bold">
                        ${result.product.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input
                type="checkbox"
                name="seller-details"
                checked={isSellerChecked}
              />
              <div
                className="collapse-title font-semibold"
                onClick={() => setIsSellerChecked(!isSellerChecked)}
              >
                Seller Details
              </div>
              <div className="collapse-content text-sm">
                <div className="space-y-2 divide-y divide-gray-200">
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Seller Name:</span>
                    <span>{result.seller?.sellerName}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Positive Feedback:</span>
                    <span>{result.seller?.posFeedbackPercent}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Total Feedback:</span>
                    <span>{result.seller?.totalRatingCount}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">
                      Last 30 Days of Feedback:
                    </span>
                    <span>{result.seller?.thirtyDayRatingCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleWatchClick}
          className="btn btn-accent mt-4 w-full"
        >
          Add to Watchlist
        </button>
      </div>
      {/* Price History Section */}
      <div className="basis-6/12 flex flex-col w-full px-4 space-y-4">
        <h1 className="text-2xl font-semibold text-black ">
          {result.product.name}
        </h1>

        {comparisonCards ? (
          <>
            <ProductDetailsGraph
              currentProduct={result}
              products={comparisonCards}
              graphType={GraphType.PriceHistory}
            />
            {/* Add a fixed height container for the Similar Items graph */}
            <div className="h-72">
              {" "}
              {/* Add fixed height container */}
              <ProductDetailsGraph
                currentProduct={result}
                products={comparisonCards.filter(
                  (card) => card.isChecked === true
                )}
                graphType={GraphType.SimilarItems}
                cachedItems={cachedItems}
                onSimilarItemClick={handleSimilarItemClick}
              />
            </div>
          </>
        ) : (
          <>
            <ProductDetailsGraph
              currentProduct={result}
              products={[]}
              graphType={GraphType.PriceHistory}
            />
          </>
        )}
      </div>

      {/* Item Routing */}
      <div className="basis-4/12 h-full flex flex-col">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl text-black">Where to Buy:</h2>
          </div>

          <div className="p-2 flex space-y-4 flex-col rounded-lg bg-white shadow-lg overflow-auto h-full">
            <VendorCard
              platform={result.product.platform}
              price={result.product.price ?? 0}
              lastUpdated={
                result.product.priceHistory?.[
                  result.product.priceHistory.length - 1
                ]?.date
              }
              imageUrl={result.product.imageURL || undefined}
              productUrl={result.product.productUrl}
              id={result.product._id}
            />
            {/* Additional vendor cards can be added here when we have multiple vendor data */}
          </div>
        </div>
        {comparisonCards ? (
          <div className="flex flex-col space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-xl text-black">Compare</h2>
              {/* Show current page indicator */}
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Add pagination controls above the cards only */}
            {totalPages > 1 && <Pagination />}

            <div className="p-2 flex space-y-4 flex-col rounded-lg bg-white shadow-lg max-h-fit border">
              {getCurrentPageItems().map((card) => (
                <SearchResultCard
                  key={card.product._id}
                  result={card}
                  defaultChecked={card.isChecked}
                  onClick={handleCardClick}
                  checkChanged={handleCardCheckChanged}
                />
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
