import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle, AiOutlineCheckCircle } from "react-icons/ai";
import Footer from "components/Footer/Footer.js";
import "./SetNewPassword.css";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setSuccessMessage("");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccessMessage("");
      return;
    }
    setError("");
    setSuccessMessage("Your password has been reset successfully!");
  };

  return (
    <>
      <div className="set-password-container">
      <div className="set-password-box">
        {successMessage && (
          <div className="success-message">
            <AiOutlineCheckCircle className="success-icon" /> {successMessage}
          </div>
        )}
        {error && (
            <div className="error-message">
            <AiOutlineExclamationCircle className="error-icon" /> {error}
            </div>
        )}

        <h2>Set new password</h2>
        <p>Password must have at least 8 characters</p>
        <form onSubmit={handleResetPassword}>
          <label>Password</label>
          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter at least 8+ characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <label>Confirm Password</label>
          <div className="input-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter at least 8+ characters"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button type="submit">Reset password</button>
        </form>

        <p>
          Back to <a href="/login">Log in</a>
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

export default SetNewPassword;
