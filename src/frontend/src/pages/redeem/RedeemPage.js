import React, { useState, useEffect } from "react";
import styles from "./RedeemPage.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import userAPI from "services/userService";

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
    name: "Giảm ngay 50K",
    description: "Với hóa đơn chỉ từ 0đ",
    points: 500,
    image: pateCotDen,
  },
];

const RedeemPage = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null); // Quản lý trạng thái popup

  const fetchUserPoints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userAPI.getProfile();
      setUserPoints(userData.loyaltyPoints || 0);
    } catch (error) {
      console.error("Lỗi khi lấy điểm người dùng:", error);
      setError("Không thể tải điểm thưởng. Vui lòng thử lại.");
      setUserPoints(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (points) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await userAPI.redeemPoints(points);
      alert(`Đổi điểm thành công! Mã giảm giá: ${result.data.discountCode}`);
      fetchUserPoints(); // Cập nhật lại điểm sau khi đổi
    } catch (error) {
      console.error("Lỗi khi đổi điểm:", error);
      setError(error.message || "Không thể đổi điểm. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setSelectedReward(null); // Đóng popup sau khi đổi
    }
  };

  const confirmRedeem = (reward) => {
    setSelectedReward(reward); // Hiển thị popup xác nhận
  };

  const closePopup = () => {
    setSelectedReward(null); // Đóng popup
  };

  useEffect(() => {
    fetchUserPoints();
  }, []);

  return (
    <div className={styles.redeemContainer}>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Số điểm hiện tại</h2>
        <div className={styles.points}>
          <img src={beanIcon} alt="Beans" />
          {isLoading ? (
            <span>Đang tải...</span>
          ) : error ? (
            <span>{error}</span>
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
              <button
                className={styles.redeemButton}
                disabled={userPoints < reward.points || isLoading}
                onClick={() => confirmRedeem(reward)}
              >
                Đổi {reward.points} điểm
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedReward && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>Xác nhận đổi điểm</h3>
            <p>
              Bạn có chắc chắn muốn đổi{" "}
              <strong>{selectedReward.points} điểm</strong> để nhận{" "}
              <strong>{selectedReward.name}</strong>?
            </p>
            <div className={styles.popupActions}>
              <button
                className={styles.confirmButton}
                onClick={() => handleRedeem(selectedReward.points)}
              >
                Xác nhận
              </button>
              <button className={styles.cancelButton} onClick={closePopup}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default RedeemPage;
