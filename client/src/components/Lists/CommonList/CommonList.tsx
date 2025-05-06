import { ItemType } from "../../../types";
import CommonItemCard from "../../Cards/CommonItemCard/CommonItemCard";

const CommonList = ({ items }: { items: ItemType[] }) => {
  return (
    <div className="p-2 flex space-y-4 flex-col rounded-lg bg-white shadow-lg overflow-auto h-full">
      {items.map((item: ItemType, key = 0) => {
        return <CommonItemCard item={item} key={key++} />;
      })}
    </div>
  );
};

export default CommonList;
