import React from "react";
import styles from "./AccountDropdown.module.css";

// Import các ảnh
import memberIcon from "assets/icon/member.png";
import beanIcon from "assets/icon/bean.png";
import orderIcon from "assets/icon/order-history.png";
import trackOrderIcon from "assets/icon/order-track.png"; // Sử dụng ảnh icon sẵn có hoặc thêm file mới
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
          <a href="/order" className={styles.dropdownItem}>
            <img src={orderIcon} alt="Đơn hàng" className={styles.icon} />
            Đơn hàng
          </a>
          <a href="/menu" className={styles.dropdownItem}>
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
          {/* Thêm liên kết tra cứu đơn hàng cho người dùng chưa đăng nhập */}
          <a href="/track-order" className={styles.dropdownItem}>
            <img src={orderIcon} alt="Tra cứu đơn hàng" className={styles.icon} />
            Tra cứu đơn hàng
          </a>
        </>
      )}
      
      {/* Luôn hiển thị liên kết tra cứu đơn hàng ở cuối menu dù đã đăng nhập hay chưa */}
      {isLoggedIn && (
        <a href="/track-order" className={styles.dropdownItem}>
          <img src={orderIcon} alt="Tra cứu đơn hàng" className={styles.icon} />
          Tra cứu đơn hàng
        </a>
      )}
    </div>
  );
};

export default AccountDropdown;
