import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5050/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.message || "Password reset successfully.");
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to reset password.");
      setSuccess(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Reset Your Password</h2>
      <div style={styles.card}>
        <form onSubmit={handleResetPassword}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {message && (
            <div style={{
              ...styles.messageBox,
              backgroundColor: success ? "#E0FFE0" : "#FFCCCC",
              color: success ? "#4CAF50" : "#D8000C",
            }}>
              {message}
            </div>
          )}

          <button type="submit" style={styles.button}>Reset Password</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    color: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#f4f4f4",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  inputGroup: { marginBottom: "15px" },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#E4EEFF",
  },
  messageBox: {
    padding: "10px",
    marginTop: "15px",
    borderRadius: "4px",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4386C4",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default ResetPassword;
