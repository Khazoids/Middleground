import { Link } from "react-router-dom";
import { SearchResult } from "../../types/Search";

const CommonItemCard = ({ item }: { item: SearchResult }) => {
  return (
    <div className="card bg-white shadow hover:shadow-lg transition-shadow cursor-pointer">
      <div className="card-body p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0">
            {item.product.imageURL && (
              <img
                src={item.product.imageURL.toString()}
                alt={item.product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Product Info and Price Container */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Product Info */}
            <div>
              <Link to={`/product/${item.product._id}`}>
                <h2 className="text-lg text-black font-semibold line-clamp-1">
                  {item.product.name}
                </h2>
              </Link>
            </div>
            {/* Price Information */}
            <div className="flex text-black justify-between">
              <div
                className={`badge text-white ${
                  item.product.platform === "Amazon"
                    ? "bg-[#FF9900]"
                    : item.product.platform === "eBay"
                    ? "bg-[#86B817]"
                    : item.product.platform === "Best Buy"
                    ? "bg-[#0a4abf]"
                    : "badge-secondary"
                }`}
              >
                <p>{item.product.platform}</p>
              </div>
              <div className="text-lg font-bold">
                ${item.product.price ? item.product.price.toFixed(2) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonItemCard;
