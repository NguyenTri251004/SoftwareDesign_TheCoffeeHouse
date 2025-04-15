import React from "react";
import styles from "./AccountDropdown.module.css";

// Import các ảnh
import memberIcon from "assets/icon/member.png";
import beanIcon from "assets/icon/bean.png";
import couponIcon from "assets/icon/coupon.png";
import shipIcon from "assets/icon/ship.png";
import signupIcon from "assets/icon/signup.png";
import signinIcon from "assets/icon/signin.png";

const AccountDropdown = ({ isLoggedIn }) => {
  return (
    <div className={styles.dropdownContainer}>
      {isLoggedIn ? (
        <>
          {console.log("Đã đăng nhập")}
          <a href="/user/profile" className={styles.dropdownItem}>
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
        </>
      ) : (
        <>
          {console.log("Chưa đăng nhập - hiện đăng nhập/đăng ký")}
          <a href="/login" className={styles.dropdownItem}>
            <img src={signinIcon} alt="" className={styles.icon} />
            Đăng nhập
          </a>
          <a href="/signup" className={styles.dropdownItem}>
            <img src={signupIcon} alt="" className={styles.icon} />
            Đăng ký
          </a>
        </>
      )}
    </div>
  );
};

export default AccountDropdown;
