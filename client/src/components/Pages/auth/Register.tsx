import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;
import NotificationToast from "../NotificationToast";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");

  const navigate = useNavigate();
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.includes("@")) {
      return showNotification("Please enter a valid email address.", "error");
    }

    if (password.length < 6) {
      return showNotification(
        "Password must be at least 6 characters.",
        "error"
      );
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: email,
        password,
        zipCode,
        firstName,
        lastName,
      });

      showNotification(
        "Registration successful! Please check your email to verify your account.",
        "success"
      );
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unknown error occurred.";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <div
      style={{
        color: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
      }}
      className="h-full"
    >
      {notification.show && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}

      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Sign Up
      </h2>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <form onSubmit={handleRegister}>
          {/* First Name */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="firstName" style={labelStyle}>
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="lastName" style={labelStyle}>
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Zip Code */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="zipCode" style={labelStyle}>
              Shipping Zip Code
            </label>
            <input
              id="zipCode"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4386C4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Sign Up
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              style={{
                background: "none",
                color: "#007BFF",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Click here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontSize: "14px",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "4px",
  backgroundColor: "#E4EEFF",
};

export default Register;
