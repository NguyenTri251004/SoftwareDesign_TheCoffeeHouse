import styles from "./ModalAddress.module.css";
import AddressMap from "../../pages/checkout/AddressMap";
import { useState } from "react";

const ModalAddress1 = ({ onClose }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (address.trim() !== "") {
      localStorage.setItem("userAddress", address);
      onClose();
    }
  };

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
          placeholder="Vui lòng nhập địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.input}
          required
        />
        {/* Map hiển thị bên dưới */}
        {address.trim() !== "" && (
          <div style={{ marginTop: "16px" }}>
            <AddressMap address={address} />
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button onClick={handleSubmit} className={styles.confirmButton}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddress1;