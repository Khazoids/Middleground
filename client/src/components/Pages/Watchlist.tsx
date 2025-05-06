import { useEffect, useState } from "react";
import WatchlistItemCard from "../Cards/WatchlistItemCard/WatchlistItemCard";
import axios from "axios";
import NotificationToast from "./NotificationToast"; // Import the NotificationToast component

const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;
const API_URL = import.meta.env.VITE_API_URL;

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const email = localStorage.getItem("userEmail");

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
      1500
    );
  };

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`${API_URL}/watchlist/watchlist`, {
          params: { email },
        });
        if (response.status === 200) {
          setWatchlist(response.data.watchlist || []);
        } else {
          console.error("Failed to fetch watchlist: ", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching watchlist: ", error);
      }
    };
    fetchWatchlist();
  }, [email]);

  const handleDelete = async (itemName: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/watchlist/watchlist/delete`,
        {
          data: { email, itemName },
        }
      );
      if (response.status === 200) {
        showNotification("Item Deleted", "success");
        setWatchlist(response.data.watchlist);
      } else {
        console.error("Failed to delete item: ", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleNotifyChange = async (
    itemName: string,
    isNotified: boolean,
    priceThreshold: number
  ) => {
    try {
      const response = await axios.put(
        `${API_URL}/watchlist/watchlist/notify`,
        {
          email,
          itemName,
          isNotified: Boolean(isNotified),
          priceChange: Number(priceThreshold),
        }
      );
      if (response.status === 200) {
        setWatchlist((prevWatchlist: any) =>
          prevWatchlist.map((item: any) =>
            item.name === itemName
              ? {
                  ...item,
                  isNotified,
                  notificationPriceThreshold: priceThreshold,
                }
              : item
          )
        );
        showNotification(
          isNotified ? "Notifications Enabled" : "Notifications Disabled",
          isNotified ? "success" : "error"
        );
      } else {
        console.error(
          "Failed to update notification status:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  return (
    <div className="h-full container justify-self-center">
      {notification.show && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}
      <div className="h-full">
        <div className="py-10 container mx-auto text-center">
          <h1>Your Watchlist</h1>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <div className="relative w-3/4">
              <input
                type="text"
                placeholder="Search watchlist..."
                className="border p-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-sm">Sort by:</span>
            <select
              className="p-2 border w-1/5"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="none">Date Added</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
              <option value="price-change-low-high">
                Price Change: Low to High
              </option>
              <option value="price-change-high-low">
                Price Change: High to Low
              </option>
            </select>
          </div>
        </div>
        <div className="watch-list space-y-4 container mx-auto p-4 overflow-auto h-2/3">
          {watchlist.length > 0 ? (
            watchlist
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .sort((a, b) => {
                if (sortOption === "price-low-high") return a.price - b.price;
                if (sortOption === "price-high-low") return b.price - a.price;
                if (sortOption === "name-a-z")
                  return a.name.localeCompare(b.name);
                if (sortOption === "name-z-a")
                  return b.name.localeCompare(a.name);
                if (sortOption === "price-change-low-high")
                  return a.priceChange - b.priceChange;
                if (sortOption === "price-change-high-low")
                  return b.priceChange - a.priceChange;
                return 0;
              })
              .map((item, index) => (
                <WatchlistItemCard
                  key={index}
                  name={item.name}
                  price={item.price}
                  vendor={item.vendor}
                  imageURL={item.picture}
                  id={item.id}
                  priceChange={item.priceChange}
                  isNotified={item.isNotified || false}
                  notificationPriceThreshold={
                    item.notificationPriceThreshold || 15
                  } // Ensure correct threshold
                  onDelete={() => handleDelete(item.name)}
                  onNotifyChange={(itemName, isNotified, priceThreshold) =>
                    handleNotifyChange(itemName, isNotified, priceThreshold)
                  }
                />
              ))
          ) : (
            <p className="text-center">Your watchlist is empty!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
