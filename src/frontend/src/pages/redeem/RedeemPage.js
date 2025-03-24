import React from "react";
import styles from "./RedeemPage.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";

import bannerImg from "assets/images/pizza-banner.png";
import beanIcon from "assets/icon/bean.png";
import pateCotDen from "assets/images/pate-cot-den.png";
import aMeQuat from "assets/images/a-me-quat.png";

const rewards = [
  {
    id: 1,
    name: "Bánh Mì Que Pate Cột Đèn",
    description: "Tặng 1 Bánh Mì Que Pate Cột Đèn",
    points: 400,
    image: pateCotDen,
  },
  {
    id: 2,
    name: "A-Mê Quất",
    description: "A-Mê Quất với giá chỉ 10.000 đồng",
    points: 400,
    image: aMeQuat,
  },
  {
    id: 3,
    name: "Bánh Mì Que Pate Cột Đèn",
    description: "Tặng 1 Bánh Mì Que Pate Cột Đèn",
    points: 400,
    image: pateCotDen,
  },
];

const RedeemPage = () => {
  return (
    <div className={styles.redeemContainer}>
      <Header />
      <div className={styles.banner}>
        <img src={bannerImg} alt="Banner" />
      </div>
      <div className={styles.container}>
        <h2 className={styles.title}>Đổi Điểm Thưởng</h2>
        <div className={styles.points}>
          <img src={beanIcon} alt="Beans" />
          <span>1630 BEAN</span>
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
              <button className={styles.redeemButton}>{reward.points}</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RedeemPage;
