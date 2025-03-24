import styles from "./ModalAddress.module.css";

const ModalAddress2 = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <img
            src="https://minio.thecoffeehouse.com/images/tch-web-order/Delivery2.png"
            alt="Giao hàng"
            className={styles.icon}
          />
          <span className={styles.title}>Giao hàng</span>
        </div>
        <input
          type="text"
          defaultValue="227 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh, Việt Nam"
          className={styles.input}
        />
        <div className={styles.buttonContainer}>
          <button className={styles.confirmButton}>Chọn địa chỉ này</button>
          <button className={styles.newAddressButton}>Nhập địa chỉ mới</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddress2;
