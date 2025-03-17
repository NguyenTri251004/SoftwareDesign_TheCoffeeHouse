import React, { useState, useRef } from "react";
import "./PasswordReset.css";

const PasswordReset = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-box">
        <h2>Password Reset</h2>
        <p>We have sent a code to your email</p>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <button>Continue</button>
        <p>
          Didn’t receive the code? <a href="#">Click here</a>
        </p>
        <p>
          Back to <a href="/login">Log in</a>
        </p>
      </div>
      <div className="image-section">
            <h1>THE COFFEE HOUSE</h1>
        </div>
    </div>
  );
};

export default PasswordReset;
