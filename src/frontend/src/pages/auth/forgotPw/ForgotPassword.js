import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      setMessage("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/auth/forgot-password", { email });

      const { message, token } = response.data;
      setMessage(message);
      setError("");

      // Sau 2 giây chuyển sang trang nhập code
      setTimeout(() => {
        navigate("/password-reset", { state: { token, email } });
      }, 2000);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="forgot-password-container">
        <div className="forgot-password-box">
          {error && (
            <div className="error-message">
              <AiOutlineExclamationCircle className="error-icon" /> {error}
            </div>
          )}
          {message && <div className="success-message">{message}</div>}

          <h2>Forgot Password</h2>
          <p>Enter your email to receive a password reset code.</p>

          <form onSubmit={handleResetPassword}>
            <label>Email</label>
            <div className="input-field">
              <MdEmail className="icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit">Reset Password</button>
          </form>

          <p>
            Remembered your password? <a href="/login">Log in</a>
          </p>
        </div>

        <div className="image-section">
          <h1>THE COFFEE HOUSE</h1>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;