import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import "./SignUpPage.css";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
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
      });

      setSuccess("Account created successfully! Redirecting to login...");
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
    <div className="signup-container">
      <div className="signup-box">
        {error && (
          <div className="error-message">
            <AiOutlineExclamationCircle className="error-icon" /> {error}
          </div>
        )}
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <label>Full Name</label>
          <div className="input-field">
            <MdPerson className="icon" />
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <label>Confirm Password</label>
          <div className="input-field">
            <MdLock className="icon" />
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

        <div className="separator">OR</div>

        <div className="social-signup">
          <button className="google"><FaGoogle /></button>
          <button className="facebook"><FaFacebookF /></button>
          <button className="apple"><FaApple /></button>
        </div>
      </div>
      <div className="image-section">
        <h1>THE COFFEE HOUSE</h1>
      </div>
    </div>
  );
};

export default Signup;
