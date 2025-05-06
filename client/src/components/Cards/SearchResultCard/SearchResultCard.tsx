import { SearchResult } from "../../../types/Search";
import { useEffect, useState } from "react";

interface SearchResultCardProps {
  result: SearchResult;
  defaultChecked: boolean;
  onClick: (searchResult: SearchResult) => void;
  checkChanged: (card: SearchResult, isChecked: boolean) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  defaultChecked,
  onClick,
  checkChanged,
}) => {
  const [isChecked, setChecked] = useState<boolean>(defaultChecked);

  const handleClick = (e?: React.MouseEvent) => {
    // If event exists, stop it from propagating to parent (won't toggle checkbox)
    if (e) {
      e.stopPropagation();
    }
    onClick(result);
  };

  useEffect(() => {
    checkChanged(result, isChecked);
  }, [isChecked]);

  // Function to stop propagation for the checkbox click
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChecked(!isChecked);
  };

  return (
    <div
      className="card bg-white shadow hover:shadow-lg transition-shadow"
      onClick={() => setChecked(!isChecked)}
    >
      <div className="card-body p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div
            className="w-24 h-24 bg-white rounded-lg flex-shrink-0 cursor-pointer"
            onClick={handleClick}
          >
            {result.product.imageURL && (
              <img
                src={result.product.imageURL}
                alt={result.product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Product Info and Price Container */}
          <div className="grow flex mx-2">
            <div className="flex-1 flex flex-col justify-between">
              {/* Product Info */}
              <div className="flex">
                <h2
                  className="text-lg text-black font-semibold line-clamp-1 cursor-pointer hover:underline"
                  onClick={handleClick}
                >
                  {result.product.name}
                </h2>
              </div>
              <div className="flex">
                <p className="text-sm text-base-content/100">
                  {result.product.brand}
                </p>
              </div>

              {/* Price Information */}
              <div className="flex text-black justify-between">
                <div
                  className={`badge text-white ${
                    result.product.platform === "Amazon"
                      ? "bg-[#FF9900]"
                      : result.product.platform === "eBay"
                      ? "bg-[#86B817]"
                      : result.product.platform === "Best Buy"
                      ? "bg-[#0a4abf]"
                      : "badge-secondary"
                  }`}
                >
                  <p>{result.product.platform}</p>
                </div>
                {result.product.price && (
                  <div className="text-lg font-bold">
                    ${result.product.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            <div className="self-center mx-2" onClick={handleCheckboxClick}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // Use the parent div's onClick instead
                className="checkbox"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
