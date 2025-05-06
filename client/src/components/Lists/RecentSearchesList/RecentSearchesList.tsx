import { RecentSearch } from "../../../types/Search";
import CommonItemCard from "../../Cards/CommonItemCard";

const RecentSearchesList = ({ items }: { items: RecentSearch[] }) => {
  return (
    <div className="space-y-4">
      {items
        .filter((item) => item && item.product)
        .map((item) => (
          <CommonItemCard
            key={item.product._id}
            item={{
              product: {
                _id: item.product._id,
                name: item.product.name,
                platform: item.product.platform,
                price: item.product.price,
                imageURL: item.product.imageURL,
              },
            }}
          />
        ))}
    </div>
  );
};

export default RecentSearchesList;
