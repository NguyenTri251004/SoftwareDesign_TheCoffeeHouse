import React, { useState, useEffect } from "react"; // Thêm useState và useEffect
import styles from "./RedeemPage.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import userAPI from "services/userService"; // Import userAPI

import bannerImg from "assets/images/banner-1.jpg";
import beanIcon from "assets/icon/bean.png";
import pateCotDen from "assets/images/pate-cot-den.png";
import aMeQuat from "assets/images/a-me-quat.png";

const rewards = [
  {
    id: 1,
    name: "Giảm ngay 10K",
    description: "Với hóa đơn chỉ từ 0đ",
    points: 100,
    image: pateCotDen,
  },
  {
    id: 2,
    name: "Giảm ngay 30K",
    description: "Với hóa đơn chỉ từ 0đ",
    points: 300,
    image: aMeQuat,
  },
  {
    id: 3,
    name: "Giảm ngay 30K",
    description: "Với hóa đơn chỉ từ 0đ",
    points: 500,
    image: pateCotDen,
  },
  // Add more rewards as needed
];

const RedeemPage = () => {
  // State để lưu điểm của người dùng
  const [userPoints, setUserPoints] = useState(0);
  // State cho trạng thái loading (tùy chọn nhưng nên có)
  const [isLoading, setIsLoading] = useState(true);
  // State cho lỗi (tùy chọn)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Gọi API để lấy thông tin profile
        const userData = await userAPI.getProfile();
        // Cập nhật state với điểm loyaltyPoints
        setUserPoints(userData.loyaltyPoints || 0); // Dùng 0 nếu không có điểm
      } catch (error) {
        console.error("Lỗi khi lấy điểm người dùng:", error);
        setError("Không thể tải điểm thưởng. Vui lòng thử lại.");
        // Bạn có thể xử lý lỗi cụ thể hơn ở đây, ví dụ: nếu không có token thì hiển thị 0 điểm
        setUserPoints(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPoints();
  }, []); // Mảng dependency rỗng [] để chỉ chạy 1 lần khi component mount

  return (
    <div className={styles.redeemContainer}>
      <Header />
      {/* <div className={styles.banner}>
        <img src={bannerImg} alt="Banner" />
      </div> */}
      <div className={styles.container}>
        <h2 className={styles.title}>Số điểm hiện tại</h2>
        <div className={styles.points}>
          <img src={beanIcon} alt="Beans" />
          {isLoading ? (
            <span>Đang tải...</span>
          ) : error ? (
             <span>Lỗi tải điểm</span>
          ) : (
             <span>{userPoints} BEAN</span>
          )}
        </div>
        <div className={styles.rewardsGrid}>
          {rewards.map((reward) => (
            <div key={reward.id} className={styles.rewardCard}>
              <img
                src={reward.image}
                alt={reward.name}
                className={styles.rewardImage}
              />
              <h3 className={styles.rewardName}>{reward.name}</h3>
              <p className={styles.rewardDescription}>{reward.description}</p>
              {/* Nút đổi quà có thể cần disable nếu không đủ điểm */}
              <button
                className={styles.redeemButton}
                disabled={userPoints < reward.points || isLoading || error} // Disable nếu đang load, có lỗi hoặc không đủ điểm
              >
                {reward.points}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RedeemPage;