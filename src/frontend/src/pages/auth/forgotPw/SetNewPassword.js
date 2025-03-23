import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle, AiOutlineCheckCircle } from "react-icons/ai";
import styles from "./SetNewPassword.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;
  const email = location.state?.email;

  const handleResetPassword = async (e) => {
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

    try {
      const response = await axios.post("http://localhost:5001/api/auth/reset-password", {
        token,
        password,
      });

      setSuccessMessage(response.data.message || "Password reset successfully!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div className={styles.setPasswordContainer}>
        <div className={styles.setPasswordBox}>
          {successMessage && (
            <div className={styles.successMessage}>
              <AiOutlineCheckCircle className={styles.successIcon} /> {successMessage}
            </div>
          )}
          {error && (
            <div className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {error}
            </div>
          )}

          <h2>Set new password</h2>
          <form onSubmit={handleResetPassword}>
            <label>Password</label>
            <div className={styles.inputField}>
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
            <div className={styles.inputField}>
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

        <div className={styles.imageSection}>
          <h1>THE COFFEE HOUSE</h1>
        </div>
      </div>
    </>
  );
};

export default SetNewPassword;