import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import Footer from "components/footer/Footer.js";

import "./LoginPage.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      // Save token to localStorage or sessionStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Redirect to dashboard or homepage
      window.location.href = "/dashboard"; // Change to your route
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
      <div className="login-box">
        {error && (
          <div className="error-message">
            <AiOutlineExclamationCircle className="error-icon" /> {error}
          </div>
        )}
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
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

          <label>Password</label>
          <div className="input-field">
            <MdLock className="icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>

        <div className="separator">OR</div>

        <div className="social-login">
          <button className="google"><FaGoogle /></button>
          <button className="facebook"><FaFacebookF /></button>
          <button className="apple"><FaApple /></button>
        </div>
      </div>

      <div className="image-section">
        <h1>THE COFFEE HOUSE</h1>
      </div>
      
    </div>
    <Footer />
    </>
    
  );
};

export default Login;