import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import styles from "./Footer.module.css"; 

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Left Section - Contact Info */}
        <div className={styles.footerSection}>
          <ul>
            <li><FaMapMarkerAlt className={styles.icon} /> 67 Đinh Bộ Lĩnh, P.26, Bình Thạnh, TP.HCM</li>
            <li><FaPhoneAlt className={styles.icon} /> (+84) 363 567 239</li>
            <li><FaEnvelope className={styles.icon} /> nhacaphe@gmail.com</li>
          </ul>
        </div>

        {/* Center Section - Links */}
        <div className={styles.footerSection}>
          <ul>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Trà</a></li>
            <li><a href="#">Cà phê</a></li>
            <li><a href="#">Danh sách cửa hàng</a></li>
          </ul>
        </div>

        {/* Right Section - Social & Button */}
        <div className={styles.footerSection}>
          <h3>THE COFFEE HOUSE</h3>
          <a href="/menu"><button className={styles.menuButton}>Menu →</button></a>
          
          <div className={styles.socialIcons}>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={styles.footerBottom}>
        © 2025 Nhà Cà Phê, Inc. • <a href="#">Privacy</a> • <a href="#">Terms</a>
      </div>
    </footer>
  );
};

export default Footer;
