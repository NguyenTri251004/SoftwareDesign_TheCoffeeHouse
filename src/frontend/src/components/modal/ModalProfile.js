import { useState } from "react";
import styles from "./ModalProfile.module.css";

const ModalProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    birthdate: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const logo = require("assets/icon/telephone.png");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton}>&times;</button>
        <h2 className={styles.title}>Hồ sơ thành viên</h2>
        <div className={styles.avatarWrapper}>
          <img src={logo} alt="Avatar" className={styles.avatar} />
        </div>
        <h3 className={styles.memberType}>Thành Viên Vàng</h3>

        <div className={styles.formGroup}>
          <label>Họ tên</label>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Ngày sinh</label>
          <input
            type="date"
            name="birthdate"
            placeholder="Ngày sinh"
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>SDT</label>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            onChange={handleChange}
          />
        </div>

        <button className={styles.saveButton}>Lưu</button>
      </div>
    </div>
  );
};

export default ModalProfile;
