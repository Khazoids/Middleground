import React, { useState, useEffect } from "react";
import NotificationBell from "../../../assets/NotificationBell";
import TrashCan from "../../../assets/TrashCan";
import { GearIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import axios from "axios";

const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;
const API_URL = import.meta.env.VITE_API_URL;

interface WatchlistItemProps {
  name: string;
  price: number;
  vendor: string;
  imageURL?: string;
  isNotified: boolean;
  notificationPriceThreshold: number;
  id: string;
  priceChange: number;
  onDelete: () => void;
  onNotifyChange: (
    itemName: string,
    notifyPriceDrop: boolean,
    priceThreshold: number
  ) => void;
  priceMonitoringPeriod: number;
  onPeriodChange: (itemName: string, period: number) => void;
}

const priceChangeDaysOptions = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "1 Month", value: 30 },
  { label: "1 Year", value: 365 },
];

const WatchlistItemCard: React.FC<WatchlistItemProps> = ({
  name,
  price,
  vendor,
  imageURL,
  isNotified: initialIsNotified,
  notificationPriceThreshold: initialThreshold,
  id,
  priceChange,
  onDelete,
  onNotifyChange,
  priceMonitoringPeriod: initialMonitoringPeriod,
  onPeriodChange,
}) => {
  const [isNotified, setIsNotified] = useState<boolean>(initialIsNotified);
  const [priceThreshold, setPriceThreshold] =
    useState<number>(initialThreshold);
  const [monitoringPeriod, setMonitoringPeriod] = useState<number>(
    initialMonitoringPeriod
  );
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usePriceLimit, setUsePriceLimit] = useState<boolean>(
    initialThreshold > 0
  );
  const [priceLimitValue, setPriceLimitValue] = useState<number | null>(
    initialThreshold || null
  );

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    setIsNotified(initialIsNotified);
    setPriceThreshold(initialThreshold);
    setMonitoringPeriod(initialMonitoringPeriod);
    setPriceLimitValue(initialThreshold > 0 ? initialThreshold : null);
  }, [initialIsNotified, initialThreshold, initialMonitoringPeriod]);

  useEffect(() => {
    const fetchCurrentSettings = async () => {
      if (!isSettingsModalOpen) return;

      try {
        const response = await axios.get(`${API_URL}/watchlist/watchlist`, {
          params: { email },
        });

        const currentItem = response.data.watchlist.find(
          (item: any) => item.name === name
        );
        if (currentItem) {
          setMonitoringPeriod(
            currentItem.priceChangePeriod || initialMonitoringPeriod
          );
          setPriceThreshold(currentItem.priceChange);
          setPriceLimitValue(currentItem.usePriceLimit);
        }
      } catch (error) {
        console.error("Error fetching current settings:", error);
      }
    };

    fetchCurrentSettings();
  }, [isSettingsModalOpen, email, name, initialMonitoringPeriod]);

  const handleNotificationClick = () => {
    setIsNotifyModalOpen(true);
  };

  const handleSaveNotification = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/watchlist/watchlist/notify`,
        {
          email,
          itemName: name,
          isNotified,
          priceChange: usePriceLimit ? priceLimitValue : priceThreshold,
          usePriceLimit,
        }
      );

      if (response.status === 200) {
        onNotifyChange(
          name,
          isNotified,
          usePriceLimit ? priceLimitValue ?? 0 : priceThreshold
        );
        setIsNotifyModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePeriod = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/watchlist/watchlist/period`,
        {
          email,
          itemName: name,
          priceChangePeriod: monitoringPeriod,
        }
      );
      if (response.status === 200) {
        setIsSettingsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating monitoring period:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsNotified(initialIsNotified);
    setPriceThreshold(initialThreshold);
    setMonitoringPeriod(initialMonitoringPeriod);
    setUsePriceLimit();
    setPriceLimitValue(initialThreshold > 0 ? initialThreshold : null);
    setIsNotifyModalOpen(false);
    setIsSettingsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="custom-card border rounded-lg shadow-lg basis-1/2 mr-4">
          <div className="custom-card-head flex max-h-48 bg-slate-200 rounded-lg">
            <img
              src={imageURL || "https://via.placeholder.com/150"}
              className="custom-card-head-image h-40 rounded-lg"
              alt={name}
            />
            <div className="custom-card-head-description p-4 w-full">
              <div className="item-title text-xl flex">
                <Link className="grow" to={`/product/${id}`}>
                  <p>{name}</p>
                </Link>
              </div>
            </div>
          </div>

          <div className="custom-card-body text-base bg-slate-100 rounded-lg p-2">
            <p>Last Found Listings</p>
            <div className="divider"></div>
            <div className="list-vendor-info flex">
              <div
                className={`badge text-white ${
                  vendor === "Amazon"
                    ? "bg-[#FF9900]"
                    : vendor === "eBay"
                    ? "bg-[#86B817]"
                    : vendor === "Best Buy"
                    ? "bg-[#0a4abf]"
                    : "badge-primary"
                }`}
              >
                {vendor}
              </div>
              <div className="item-name grow ml-4">{name}</div>
              <div className="item-price">
                {price !== undefined
                  ? `$${price.toFixed(2)}`
                  : "Price Unavailable"}
              </div>
            </div>
            <div className="divider"></div>
            {priceChange !== null ? (
              priceChange === 0 ? (
                <div className="text-center text-gray-500">No price change</div>
              ) : (
                <div
                  className={`text-center text-lg font-bold ${
                    priceChange > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {priceChange > 0 ? "▲" : "▼"}{" "}
                  {Math.abs(priceChange).toFixed(2)}%{" "}
                  {priceChange > 0 ? "increase" : "decrease"}
                </div>
              )
            ) : (
              <div className="text-center text-gray-500">No price history</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <button
            className="btn btn-error size-16"
            onClick={onDelete}
            title="Remove from Watchlist"
          >
            <TrashCan fill={"#FFFFFF"} />
          </button>
          <button
            className={`btn size-16 ${
              isNotified ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={handleNotificationClick}
            title="Set notification threshold or price limit"
          >
            <NotificationBell fill={"#FFFFFF"} />
          </button>
          <button
            className="btn btn-info size-16"
            onClick={() => setIsSettingsModalOpen(true)}
            title="Set how far back to compare prices"
          >
            <GearIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Notification Settings Modal */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3 text-blue-500 text-center">
              Notify if Price Drops
            </h2>
            <div className="flex flex-col space-y-3">
              <label className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg cursor-pointer">
                <span className="font-medium">Enable Notifications</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  checked={isNotified}
                  onChange={() => setIsNotified(!isNotified)}
                />
              </label>
              <p className="text-xs text-gray-500 ml-2">
                Turn on notifications to receive alerts about price drops.
              </p>

              {isNotified && (
                <>
                  <label className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg cursor-pointer">
                    <span className="font-medium">Use Price Limit</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-accent"
                      checked={usePriceLimit}
                      onChange={() => setUsePriceLimit(!usePriceLimit)}
                    />
                  </label>
                  <p className="text-xs text-gray-500 ml-2">
                    Use a specific price point instead of a percentage to
                    trigger notifications.
                  </p>

                  {usePriceLimit ? (
                    <div className="flex flex-col items-center mt-2">
                      <input
                        type="number"
                        placeholder="Enter price limit ($)"
                        className="input input-bordered w-full"
                        value={priceLimitValue ?? ""}
                        onChange={(e) =>
                          setPriceLimitValue(Number(e.target.value))
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You'll be notified when the price drops below this
                        value.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center mt-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceThreshold}
                        onChange={(e) =>
                          setPriceThreshold(parseInt(e.target.value, 10))
                        }
                        className="range range-accent"
                      />
                      <span className="text-center font-medium">
                        {priceThreshold}%
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Set the percentage change required to trigger a
                        notification.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button className="btn btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="btn btn-accent"
                onClick={handleSaveNotification}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Period Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3 text-blue-500 text-center">
              Price Monitoring Settings
            </h2>
            <div className="flex flex-col gap-3">
              <label className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg">
                <span className="font-medium">Monitoring Period</span>
                <select
                  className="select select-accent"
                  value={monitoringPeriod}
                  onChange={(e) => setMonitoringPeriod(Number(e.target.value))}
                >
                  {priceChangeDaysOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-xs text-gray-500 ml-2">
                Choose how far back in time to look when comparing current
                prices with past prices.
              </p>
            </div>
            <div className="flex justify-between mt-4">
              <button className="btn btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="btn btn-accent"
                onClick={handleSavePeriod}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchlistItemCard;
