import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

const vendors = ["Amazon", "eBay", "Walmart"];
const priceChangeDaysOptions = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "1 Month", value: 30 },
  { label: "1 Year", value: 365 },
];

const Settings = () => {
  const [formData, setFormData] = useState({
    email: "",
    vendor: "",
    notificationItemRemoved: false,
    notificationPriceBool: false,
    notificationPrice: 15, // Default percentage from schema
    priceChangePeriod: 1, // Default price change period (1 day)
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) throw new Error("Email not found in localStorage.");

        const response = await axios.get(`${API_URL}/dashboard/settings`, {
          params: { email },
        });

        setFormData(response.data);
      } catch (error: any) {
        console.error("Error fetching settings:", error);
        alert(error.response?.data || "Error fetching user settings.");
      }
    };

    fetchSettings();
  }, []);

  // Save settings whenever formData changes
  useEffect(() => {
    if (formData.email) handleSave();
  }, [formData]);

  const handleSave = async () => {
    try {
      await axios.post(`${API_URL}/dashboard/settings`, {
        username: formData.email,
        vendor: formData.vendor,
        notificationItemRemoved: formData.notificationItemRemoved,
        notificationPriceBool: formData.notificationPriceBool,
        notificationPrice: formData.notificationPrice,
        priceChangePeriod: formData.priceChangePeriod,
      });
      console.log("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    }
  };

  // Handle vendor selection
  const handleVendorChange = (vendor: string) => {
    setFormData((prev) => ({
      ...prev,
      vendor,
    }));
  };

  // Handle notification toggles
  const handleNotificationChange = (type: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Handle price change notification slider
  const handlePriceChangeSlider = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      notificationPrice: parseInt(event.target.value, 10),
    });
  };

  // Handle price change period selection
  const handlePriceChangePeriod = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      priceChangePeriod: event.target.value,
    });
  };

  return (
    <div className="p-8 container justify-self-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>

      {/* Notification Settings */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm">
          {/* Price Change Notification Toggle */}
          <label className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg cursor-pointer">
            <span className="font-medium">
              Enable Price Change Notification
            </span>
            <input
              type="checkbox"
              className="checkbox checkbox-accent"
              checked={formData.notificationPriceBool}
              onChange={() => handleNotificationChange("notificationPriceBool")}
            />
          </label>

          {/* Price Change Slider (Always shown when enabled) */}
          {formData.notificationPriceBool && (
            <div className="flex flex-col px-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.notificationPrice}
                onChange={handlePriceChangeSlider}
                className="range range-accent"
              />
              <span className="text-center font-medium">
                {formData.notificationPrice}%
              </span>
            </div>
          )}

          {/* Item Removed Notification */}
          <label className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg cursor-pointer">
            <span className="font-medium">Item Removed Notification</span>
            <input
              type="checkbox"
              className="checkbox checkbox-accent"
              checked={formData.notificationItemRemoved}
              onChange={() =>
                handleNotificationChange("notificationItemRemoved")
              }
            />
          </label>
        </div>
      </div>

      {/* Vendor Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Searched Vendors</h2>
        <div className="flex flex-row gap-3 p-4 bg-white rounded-lg shadow-sm">
          {vendors.map((vendor) => (
            <button
              key={vendor}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                formData.vendor === vendor
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => handleVendorChange(vendor)}
            >
              {vendor}
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist Settings */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Watchlist Settings</h2>
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm">
          {/* Price Change Period Selector */}
          <label className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg">
            <span className="font-medium">Price Change Monitoring Period</span>
            <select
              className="select select-accent"
              value={formData.priceChangePeriod}
              onChange={handlePriceChangePeriod}
            >
              {priceChangeDaysOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
