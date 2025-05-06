import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import NotificationToast from "./NotificationToast";

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

const Profile = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    zipCode: "",
    vendor: "",
    cardInfo: "",
    billingAddress: "",
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error", // TypeScript type enforcement
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

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const email = localStorage.getItem("userEmail"); // Get email from localStorage
        if (!email) {
          throw new Error("Email not found in localStorage.");
        }

        // Make the request with query params
        const response = await axios.get(`${API_URL}/dashboard/profile`, {
          params: { email },
        });
        //alert(response.data.billingAddress)
        setFormData(response.data);
        formData.email = email; // Update form data with response
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        alert(error.response?.data || "Error fetching user profile.");
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [editingField!]: e.target.value });
  };

  const handleSave = async () => {
    setEditingField(null);

    try {
      const response = await axios.post(`${API_URL}/dashboard/profile`, {
        username: formData.email,
        zipCode: formData.zipCode,
        vendor: formData.vendor,
        cardInfo: formData.cardInfo,
        billingAddress: formData.billingAddress,
      });
      showNotification("Change Successful", "success");
      console.log("Login successful:", response.data);
      //alert("Login successful!");
      // const response = await fetch("/api/profile", {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error("Failed to update profile.");

      //alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile.");
    }
  };

  const handleEdit = (field: string) => setEditingField(field);

  const handlePassword = async () => {
    //showNotification("Password change request sent");

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: formData.email,
      });

      console.log("Password change successful:", response.data);
      showNotification("Password change request sent");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unknown error occurred.";
      console.error("Error registering user:", errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div className="container justify-self-center">
      {notification.show && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
      <div className="profile-section">
        {/* Email Address */}
        <div className="profile-item">
          <label>Email Address</label>
          <div className="row">
            {editingField === "email" ? (
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleSave} // Save on blur
                autoFocus
              />
            ) : (
              <>
                <div className="value">{formData.email}</div>
                <button
                  onClick={() => handleEdit("email")}
                  className="change-btn"
                >
                  Change
                </button>
              </>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="profile-item">
          <label>Password</label>
          <div className="row">
            {editingField === "password" ? (
              <input
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <>
                <div className="value">{formData.password}</div>
                <button onClick={handlePassword} className="change-btn">
                  Change
                </button>
              </>
            )}
          </div>
        </div>

        {/* Shipping Zip Code */}
        <div className="profile-item">
          <label>Shipping Zip Code</label>
          <div className="row">
            {editingField === "zipCode" ? (
              <input
                type="text"
                value={formData.zipCode}
                onChange={handleInputChange}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <>
                <div className="value">{formData.zipCode}</div>
                <button
                  onClick={() => handleEdit("zipCode")}
                  className="change-btn"
                >
                  Change
                </button>
              </>
            )}
          </div>
        </div>

        {/* Vendor Dropdown */}
        <div className="profile-item">
          <label>Vendor</label>
          <div className="row">
            {editingField === "vendor" ? (
              <select
                value={formData.vendor}
                onChange={(e) =>
                  setFormData({ ...formData, vendor: e.target.value })
                }
                onBlur={handleSave}
                autoFocus
              >
                <option value="Amazon">Amazon</option>
                <option value="eBay">eBay</option>
                <option value="Walmart">Walmart</option>
              </select>
            ) : (
              <>
                <div className="value">{formData.vendor || "Not selected"}</div>
                <button
                  onClick={() => handleEdit("vendor")}
                  className="change-btn"
                >
                  Change
                </button>
              </>
            )}
          </div>
        </div>

        {/* Card Information */}
        <div className="profile-item">
          <label>Card Information</label>
          <div className="row">
            {editingField === "cardInfo" ? (
              <input
                type="text"
                value={formData.cardInfo}
                onChange={handleInputChange}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <>
                <div className="value">{formData.cardInfo}</div>
                <button
                  onClick={() => handleEdit("cardInfo")}
                  className="change-btn"
                >
                  Change
                </button>
              </>
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="profile-item">
          <label>Billing Address</label>
          <div className="row">
            {editingField === "billingAddress" ? (
              <textarea
                value={formData.billingAddress}
                onChange={handleInputChange}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <>
                <div className="value">{formData.billingAddress}</div>
                <button
                  onClick={() => handleEdit("billingAddress")}
                  className="change-btn"
                >
                  Change
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
