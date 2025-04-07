import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import styles from "./SignUpPage.module.css";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        email,
        password,
        role: "customer",
        name,
      });

      setSuccess("Please check your email to verify your account.");
      setTimeout(() => {
        window.location.href = "/login"; // Redirect to login page
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.signupContainer}>
        <div className={styles.signupBox}>
          {error && (
            <div className={styles.errorMessage}>
              <AiOutlineExclamationCircle className={styles.errorIcon} /> {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <AiOutlineExclamationCircle className={styles.successIcon} /> {success}
            </div>
          )}

          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <label>Full Name</label>
            <div className={styles.inputField}>
              <MdPerson className={styles.icon} />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <label>Email</label>
            <div className={styles.inputField}>
              <MdEmail className={styles.icon} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label>Password</label>
            <div className={styles.inputField}>
              <MdLock className={styles.icon} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label>Confirm Password</label>
            <div className={styles.inputField}>
              <MdLock className={styles.icon} />
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit">Sign Up</button>
          </form>

          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>

          <div className={styles.separator}>OR</div>

          <div className={styles.socialSignup}>
            <button className={styles.google}><FaGoogle /></button>
            <button className={styles.facebook}><FaFacebookF /></button>
            <button className={styles.apple}><FaApple /></button>
          </div>
        </div>
        <div className={styles.imageSection}>
          <h1>THE COFFEE HOUSE</h1>
        </div>
      </div>
    </>
  );
};

export default Signup;
