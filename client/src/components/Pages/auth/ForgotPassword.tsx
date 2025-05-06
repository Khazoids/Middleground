import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (linkSent) return;

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      setMessage("Reset link sent.");
      setLinkSent(true);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Error sending reset link.");
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
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Forgot Password
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
        <form onSubmit={handleForgotPassword}>
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
                backgroundColor: "#E4EEFF",
              }}
            />
          </div>

          {message && (
            <div
              style={{
                padding: "10px",
                marginTop: "15px",
                borderRadius: "4px",
                backgroundColor: message.includes("Error")
                  ? "#FFCCCC"
                  : "#E0FFE0",
                color: message.includes("Error") ? "#D8000C" : "#4CAF50",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0 }}>{message}</p>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: linkSent ? "#aaa" : "#4386C4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: linkSent ? "not-allowed" : "pointer",
              marginTop: "20px",
            }}
            disabled={linkSent}
          >
            {linkSent ? "Link Sent" : "Send Reset Link"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Remember your password?{" "}
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
            Click here to login.
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
