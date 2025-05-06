import React from "react";

interface VendorCardProps {
  platform: string;
  price: number;
  productUrl?: string;
  lastUpdated?: Date;
  imageUrl?: string;
  id?: string;
}

const VendorCard: React.FC<VendorCardProps> = ({
  platform,
  price,
  productUrl,
  lastUpdated,
  imageUrl,
  id,
}) => {
  const handleBuyClick = () => {
    const url = id ? getProductUrl(platform, id) : null;
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="card bg-white shadow hover:shadow-lg transition-shadow">
      <div className="card-body p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${platform} product`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-semibold">{platform}</span>
              </div>
            )}
          </div>

          {/* Product Info and Price Container */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Vendor Info */}
            <div>
              <h2 className="text-lg font-semibold text-black">
                Buy from {platform}
              </h2>
              {lastUpdated && (
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-black">
                ${price.toFixed(2)}
              </div>
              <button
                onClick={handleBuyClick}
                className="btn btn-accent"
                disabled={!productUrl && !id}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;

export const getProductUrl = (platform: string, id: string): string => {
  if (platform === "Amazon") {
    // Amazon IDs are stored as pure ASINs in our system
    return `https://www.amazon.com/dp/${id}`;
  } else if (platform === "eBay") {
    // eBay IDs are stored in "ebay|<itemId>" format
    const itemId = id.split("|")[1] || id;
    return `https://www.ebay.com/itm/${itemId}`;
  }
  else if (platform === "Best Buy") {
    const itemId = id.split("|")[1] || id;
    return `https://www.bestbuy.com/site/${itemId}.p`;
  }
  return "";
};
