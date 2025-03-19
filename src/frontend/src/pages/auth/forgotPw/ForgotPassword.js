import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import Footer from "components/footer/Footer.js";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email.");
      setMessage("");
      return;
    }
    
    // Simulating API call
    setTimeout(() => {
      setError("");
      setMessage("A password reset link has been sent to your email.");
    }, 1000);
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
        <p>Enter your email to receive a password reset link.</p>
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
    <Footer />
    </>
    
  );
};

export default ForgotPassword;
