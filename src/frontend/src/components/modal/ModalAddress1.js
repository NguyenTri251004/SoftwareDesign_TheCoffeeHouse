import styles from "./ModalAddress.module.css";
import AddressMap from "../../pages/checkout/AddressMap";
import { useState } from "react";

const ModalAddress1 = ({ onClose }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("👤 Guest mode, không gửi lên server");
      localStorage.setItem("userAddress", address); // Luôn lưu local trước
      onClose();
      setLoading(false);
      return;
    }

    try {
      const resProfile = await fetch("http://localhost:5001/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const profileRes = await resProfile.json();

      if (!resProfile.ok) {
        throw new Error(profileRes.message || "Không lấy được profile");
      }

      // Sửa cấu trúc: Dựa trên userController.getProfile, dữ liệu nằm trong profileRes.data
      const user = profileRes;
      if (!user) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const updatedProfile = {
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        addresses: [
          ...(user.addresses || []), // Giữ các địa chỉ cũ
          {
            id: (user.addresses?.length || 0) + 1, // Tạo ID mới
            address,
            isDefault: true,
          },
        ],
      };

      const res = await fetch(`http://localhost:5001/api/user/customer/${user.id}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update thất bại");
      }

      alert("✅ Đã lưu địa chỉ mặc định!");

      console.log("✅ Địa chỉ đã được lưu:", data);
      console.log("👤 Dữ liệu người dùng sau khi cập nhật:", data);
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi lưu địa chỉ:", error);
      alert(`Không thể lưu địa chỉ: ${error.message}`);
      if (
        error.message.includes("Invalid or expired token") ||
        error.message.includes("No token provided")
      ) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
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
        {address.trim() !== "" && (
          <div style={{ marginTop: "16px" }}>
            <AddressMap address={address} />
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button onClick={handleSubmit} className={styles.confirmButton} disabled={loading}>
            {loading ? "Đang lưu..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddress1;