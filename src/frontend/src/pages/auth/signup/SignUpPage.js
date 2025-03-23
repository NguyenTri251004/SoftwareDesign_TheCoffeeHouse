import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
<<<<<<< Updated upstream
import "./SignUpPage.css";
=======
import Footer from "components/footer/Footer.js";
import styles from "./SignUpPage.module.css";
>>>>>>> Stashed changes
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
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
<<<<<<< Updated upstream
        )}

        {success && <div className="success-message">{success}</div>}

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
=======
        </div>
        <div className={styles.imageSection}>
          <h1>THE COFFEE HOUSE</h1>
        </div>
      </div>
      <Footer />
>>>>>>> Stashed changes
    </>
  );
};

export default Signup;
