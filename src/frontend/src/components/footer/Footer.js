import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Contact Info */}
        <div className="footer-section">
          <ul>
            <li><FaMapMarkerAlt className="icon" /> 67 Đinh Bộ Lĩnh, P.26, Bình Thạnh, TP.HCM</li>
            <li><FaPhoneAlt className="icon" /> (+84) 363 567 239</li>
            <li><FaEnvelope className="icon" /> nhacaphe@gmail.com</li>
          </ul>
        </div>

        {/* Center Section - Links */}
        <div className="footer-section">
          <ul>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Trà</a></li>
            <li><a href="#">Cà phê</a></li>
            <li><a href="#">Danh sách cửa hàng</a></li>
          </ul>
        </div>

        {/* Right Section - Social & Button */}
        <div className="footer-section">
          <h3>THE COFFEE HOUSE</h3>
          <button className="menu-button">Menu →</button>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        © 2025 Nhà Cà Phê, Inc. • <a href="#">Privacy</a> • <a href="#">Terms</a>
      </div>
    </footer>
  );
};

export default Footer;