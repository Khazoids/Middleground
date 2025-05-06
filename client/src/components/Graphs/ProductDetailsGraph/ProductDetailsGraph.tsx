import FilterPanel from "../../Filters/FilterPanel";
import { useEffect, useState } from "react";
import LineGraph from "../LineGraph";
import { PriceHistoryItem, SearchResult } from "../../../types/Search";
import BarChart from "../BarChart";
import {
  GraphType,
  GraphProps,
  LABEL_TRUNCATION_LENGTH,
  PERIOD_FILTER,
} from "../../../types/Graph";

const ProductDetailsGraph: React.FC<GraphProps> = ({
  currentProduct,
  products,
  graphType,
  cachedItems,
  onSimilarItemClick,
}) => {
  // Initialize with all available platforms to show all sources by default
  const [visibleSources, setVisibleSources] = useState<string[]>([
    "amazon",
    "ebay",
  ]);
  const [period, setPeriod] = useState("Last 30 Days");

  // Get unique platforms from the current products for the filter
  const availablePlatforms = (() => {
    if (!products || products.length === 0) return ["amazon", "ebay"];

    const platforms = new Set<string>();
    products.forEach((product) => {
      if (product.product?.platform) {
        platforms.add(product.product.platform.toLowerCase());
      }
    });

    // Add current product's platform if it exists
    if (currentProduct?.product?.platform) {
      platforms.add(currentProduct.product.platform.toLowerCase());
    }

    return Array.from(platforms);
  })();

  useEffect(() => {
    // Initialize with all available platforms
    setVisibleSources(availablePlatforms);
  }, [products, currentProduct]); // Re-initialize when products or current product changes

  const handleToggleSource = (source: string, enabled: boolean) => {
    if (enabled) {
      setVisibleSources((prev) => [...prev, source]);
    } else {
      setVisibleSources((prev) => prev.filter((s) => s !== source));
    }
  };

  const filterPriceHistoryByPeriod = (
    history: Array<PriceHistoryItem>,
    period: string
  ) => {
    const now = new Date();
    const filtered = history.filter((item) => {
      const itemDate = new Date(item.date);
      const diffDays = Math.floor(
        (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (period) {
        case "Last 7 Days":
          return diffDays <= 7;
        case "Last 30 Days":
          return diffDays <= 30;
        case "Last 90 Days":
          return diffDays <= 90;
        case "Last Year":
          return diffDays <= 365;
        default: // "All Time"
          return true;
      }
    });
    return filtered;
  };

  return (
    <div className="card bg-white shadow-lg">
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          {/* <FilterPanel
            labels={["amazon", "ebay"]}
            visibleSources={visibleSources}
            onToggleSource={handleToggleSource}
            filterOptions={
              {
                showPlatforms: true,
                showTimeScale: true
              }
            }
          /> */}
          {graphType === GraphType.SimilarItems && (
            <FilterPanel
              labels={availablePlatforms}
              visibleSources={visibleSources}
              onToggleSource={handleToggleSource}
              filterOptions={{
                showPlatforms: true,
                showTimeScale: false,
              }}
            />
          )}
          {graphType === GraphType.PriceHistory ? (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-accent text-black h-8 min-h-0"
              >
                {period}
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52"
              >
                {PERIOD_FILTER.map((filter) => (
                  <li key={filter}>
                    <a
                      className="text-black hover:bg-gray-100"
                      onClick={() => {
                        setPeriod(filter);
                        const dropdownElement =
                          document.activeElement as HTMLElement;
                        dropdownElement.blur();
                      }}
                    >
                      {filter}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>
        {graphType === GraphType.PriceHistory ? (
          <LineGraph
            priceHistory={filterPriceHistoryByPeriod(
              (currentProduct.product.priceHistory || []).filter((ph) =>
                visibleSources.includes(ph.source?.toLowerCase() || "")
              ),
              period
            )}
          />
        ) : (
          <BarChart
            products={products
              // Filter by checked items (controlled by the parent component)
              // AND by the selected platforms in the filter
              .filter((product) =>
                visibleSources.includes(product.product.platform.toLowerCase())
              )
              .map((product) => ({
                ...product,
                name: `${product.product.name} (${product.product.platform})`, // Add platform to name
                isCurrentItem:
                  product.product._id === currentProduct.product._id,
              }))}
            onClickItem={onSimilarItemClick}
            cachedItems={cachedItems}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailsGraph;
