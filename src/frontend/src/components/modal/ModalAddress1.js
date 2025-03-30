import styles from "./ModalAddress.module.css";
import { useState } from "react";

const ModalAddress1 = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <img src="https://minio.thecoffeehouse.com/images/tch-web-order/Delivery2.png" alt="Giao hàng" className={styles.icon} />
          <span className={styles.title}>Giao hàng</span>
        </div>
        <input
          type="text"
          placeholder="Vui lòng nhập địa chỉ"
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default ModalAddress1;
