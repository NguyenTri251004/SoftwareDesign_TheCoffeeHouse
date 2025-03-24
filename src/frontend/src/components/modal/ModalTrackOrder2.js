import styles from "./ModalTrackOrder.module.css";

const ModalTrackOrder2 = () => {
  const logo = require("assets/icon/telephone.png");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <img src={logo} alt="Xem đơn hàng" className={styles.icon} />
          </div>
          <span className={styles.title}>Xem đơn hàng</span>
        </div>
        <input
          type="text"
          placeholder="Vui lòng nhập số điện thoại đặt hàng"
          className={styles.input}
        />
        <div className={styles.buttonContainer}>
          <button className={styles.confirmButton}>Xem đơn hàng này</button>
          <button className={styles.newPhoneButton}>
            Nhập số điện thoại mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTrackOrder2;
