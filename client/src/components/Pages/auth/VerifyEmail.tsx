import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyAndLogin = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/verify-email/${token}`);
        const userEmail = res.data.email;

        // Optional: You can store this in localStorage or context
        localStorage.setItem("userEmail", userEmail);

        localStorage.setItem("firstName", res.data.firstName);
        localStorage.setItem("lastName", res.data.lastName);
        login(userEmail); // from AuthContext

        setStatus("Email verified! Logging you in...");
        setTimeout(() => navigate("/"), 1500);
      } catch (err: any) {
        setStatus(err.response?.data?.error || "Verification failed.");
      }
    };

    verifyAndLogin();
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyEmail;
