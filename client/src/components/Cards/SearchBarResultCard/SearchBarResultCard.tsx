import { SearchResult } from "../../../types/Search";

interface SearchBarResultCardProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}

const SearchBarResultCard: React.FC<SearchBarResultCardProps> = ({
  result,
  onClick,
}) => {
  return (
    <li
      className="p-4 hover:bg-blue-50 cursor-pointer border-b border-base-50 last:border-none"
      onClick={() => onClick(result)}
    >
      <div className="flex items-center gap-4">
        {/* Image */}
        {result.product.imageURL && (
          <div className="w-12 h-12 flex-shrink-0">
            <img
              src={result.product.imageURL}
              alt={result.product.name}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate text-black text-left">
            {result.product.name}
          </p>
          <div className="flex justify-between">
          <p className="text-sm text-black text-left">{result.product.brand}</p>
          <p className="text-sm text-black text-left">${result.product.price}</p>
          </div>
        </div>

        {/* Price Info (working, but commented out for now */}
        {/* <div className="text-right flex-shrink-0">
          {result.price && (
            <p className="font-bold text-black">${result.price.toFixed(2)}</p>
          )}
        </div> */}
      </div>
    </li>
  );
};

export default SearchBarResultCard;
