import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;
import NotificationToast from "../NotificationToast";

interface LoginProps {
  onLoginSuccess: () => void; // Function to update the login state
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: email, // Sending email as username
        password,
      });

      // const temp = await axios.post("${API_URL}/auth/forgot-password", {
      //   username: email,  // Sending email as usernam
      // });

      //console.log("Login successful:", temp.data);

      //console.log("Login successful:", response.data);
      showNotification("Login successful!", "success");
      //setIsLoggedIn(!isLoggedIn)
      localStorage.setItem("userEmail", email);
      localStorage.setItem("firstName", response.data.firstName);
      localStorage.setItem("lastName", response.data.lastName);
      //showNotification(response.data.lastName,"success");
      onLoginSuccess();
      login(email);
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed.";
      showNotification(errorMessage, "error");
    }

    // Simulate login success
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
          position: "relative",
          top: "-20px", // Adjust this value to position the heading
        }}
      >
        Login
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
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                //border: "1px solid #ddd",
                backgroundColor: "#E4EEFF",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                //border: "1px solid #ddd",
                backgroundColor: "#E4EEFF",
              }}
            />
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/register")}
              style={{
                background: "none",
                color: "#007BFF",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Click here.
            </button>
          </p>
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Forgot Password?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/forgotpassword")}
              style={{
                background: "none",
                color: "#007BFF",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Click here.
            </button>
          </p>
          <button
            type="submit"
            style={{
              width: "30%",
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
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
