import React from "react";
import styles from "./AccountDropdown.module.css";

// Import các ảnh
import memberIcon from "assets/icon/member.png";
import beanIcon from "assets/icon/bean.png";
import couponIcon from "assets/icon/coupon.png";
import shipIcon from "assets/icon/ship.png";

const AccountDropdown = ({ onClose }) => {
  return (
    <div className={styles.dropdownContainer} onMouseLeave={onClose}>
      <a href="#" className={styles.dropdownItem}>
        <img src={memberIcon} alt="Member" className={styles.icon} />
        Thành viên
      </a>
      <a href="/redeem" className={styles.dropdownItem}>
        <img src={beanIcon} alt="Đổi BEAN" className={styles.icon} />
        Đổi BEAN
      </a>
      <a href="#" className={styles.dropdownItem}>
        <img src={couponIcon} alt="Khuyến mãi" className={styles.icon} />
        Khuyến mãi
      </a>
      <a href="#" className={styles.dropdownItem}>
        <img src={shipIcon} alt="Giao hàng" className={styles.icon} />
        Giao hàng
      </a>
    </div>
  );
};

export default AccountDropdown;
