import { Link } from "react-router-dom";
import { ItemType } from "../../../types";

const CommonItemCard = ({ item }: { item: ItemType }) => {
  return (
    <div className="card card-compact card-side h-40 bg-white">
      {/* Card Image */}
      <figure className="max-w-40">
        <img
          className=""
          src={item.imageURL ? item.imageURL.toString() : ""}
          alt="Item"
        />
      </figure>
      {/* Card Body */}
      <div className="card-body text-left hover:bg-blue-50">
        <Link to={`/product`}>
          <h2 className="card-title">{item.name}</h2>{" "}
          {/* TODO: Implement routing */}
        </Link>
        <div className="flex justify-between">
          <p>${item.price.toString()}</p>
          <h3>{item.vendor}</h3>
        </div>
        {/* Card Badges */}
        <div className="card-actions">
          <div className="badge badge-primary badge-outline">Price up</div>
          <div className="badge badge-secondary badge-outline">Price down</div>
        </div>
      </div>
    </div>
  );
};

export default CommonItemCard;
