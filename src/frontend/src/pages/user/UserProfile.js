import React, { useState } from "react";
import styles from "./UserProfile.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import AddressMap from "../../components/map/AddressMap";
import { FaTrashAlt } from "react-icons/fa";

// Giá trị ban đầu (có thể lấy từ backend trong thực tế)
const initialFullName = "Nguyễn Văn A";
const initialEmail = "nguyenvana@example.com";
const initialPhone = "0901234567";
const initialAddresses = [
  { id: 1, address: "227 Nguyễn Văn Cừ, Quận 5, TP.HCM", isDefault: true },
  { id: 2, address: "12 Nguyễn Trãi, Quận 1, TP.HCM", isDefault: false },
];

// Component modal hiển thị map để xác nhận địa chỉ mới
function MapConfirmModal({ address, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>Xác nhận địa chỉ</h3>
        </div>
        <div className={styles.modalBody}>
          <p>Vui lòng xác nhận địa chỉ dưới đây:</p>
          <div className={styles.mapPreview}>
            <AddressMap address={address} />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Xác nhận
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

// Component modal xác nhận cho các hành động khác (như đặt mặc định hoặc xóa)
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>Xác nhận</h3>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Xác nhận
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  // Thông tin cá nhân
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [points, setPoints] = useState(1200);

  // Danh sách địa chỉ
  const [addresses, setAddresses] = useState(initialAddresses);
  const [newAddress, setNewAddress] = useState("");

  // State cho modal xác nhận thêm địa chỉ mới với map
  const [showMapConfirmModal, setShowMapConfirmModal] = useState(false);
  // State cho modal xác nhận đặt mặc định cho địa chỉ đã có
  const [showDefaultConfirmModal, setShowDefaultConfirmModal] = useState(false);
  const [candidateAddressId, setCandidateAddressId] = useState(null);
  // State cho modal xác nhận xóa địa chỉ
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [candidateDeleteAddress, setCandidateDeleteAddress] = useState(null);

  const handleAddButton = () => {
    if (!newAddress.trim()) return;
    // Mở modal xác nhận địa chỉ mới với bản đồ
    setShowMapConfirmModal(true);
  };

  // Khi người dùng xác nhận địa chỉ mới trong modal
  const confirmAddAddress = () => {
    const newId = addresses.length ? addresses[addresses.length - 1].id + 1 : 1;
    const newAddrObj = {
      id: newId,
      address: newAddress,
      isDefault: false,
    };
    setAddresses([...addresses, newAddrObj]);
    setNewAddress("");
    setShowMapConfirmModal(false);
  };

  const cancelAddAddress = () => {
    setShowMapConfirmModal(false);
  };

  // Khi người dùng nhấn "Đặt làm mặc định"
  const handleSelectAddress = (id) => {
    setCandidateAddressId(id);
    setShowDefaultConfirmModal(true);
  };

  const confirmSetDefault = () => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === candidateAddressId
          ? { ...addr, isDefault: true }
          : { ...addr, isDefault: false }
      )
    );
    setShowDefaultConfirmModal(false);
    setCandidateAddressId(null);
  };

  const cancelSetDefault = () => {
    setShowDefaultConfirmModal(false);
    setCandidateAddressId(null);
  };

  // Khi người dùng nhấn icon xóa, mở modal xác nhận xóa
  const handleRemoveAddress = (id) => {
    setCandidateDeleteAddress(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAddress = () => {
    setAddresses(addresses.filter((addr) => addr.id !== candidateDeleteAddress));
    setShowDeleteConfirmModal(false);
    setCandidateDeleteAddress(null);
  };

  const cancelDeleteAddress = () => {
    setShowDeleteConfirmModal(false);
    setCandidateDeleteAddress(null);
  };

  const handleSave = () => {
    console.log("Saved information:", { fullName, email, phone, addresses });
    alert("Thông tin của bạn đã được lưu thành công!");
  };

  // Kiểm tra xem thông tin có bị thay đổi so với giá trị ban đầu không
  const isProfileUnchanged =
    fullName === initialFullName &&
    email === initialEmail &&
    phone === initialPhone &&
    JSON.stringify(addresses) === JSON.stringify(initialAddresses);

  return (
    <div>
      <Header />
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Thông tin cá nhân</h1>
        <div className={styles.personalInfo}>
          <div className={styles.field}>
            <label>Họ tên:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Điểm tích:</label>
            <span className={styles.points}>{points} điểm</span>
          </div>
        </div>
        {/* Danh sách địa chỉ */}
        <h2 className={styles.subtitle}>Danh sách địa chỉ</h2>
        <ul className={styles.addressList}>
          {addresses.map((addr) => (
            <li key={addr.id} className={styles.addressItem}>
              <div className={styles.addressInfo}>
                <span className={styles.addressText}>{addr.address}</span>
                {addr.isDefault && (
                  <span className={styles.defaultBadge}>Mặc định</span>
                )}
              </div>
              <div className={styles.addressActions}>
                {!addr.isDefault && (
                  <button
                    className={styles.setDefaultButton}
                    onClick={() => handleSelectAddress(addr.id)}
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveAddress(addr.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Nhập địa chỉ mới"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button className={styles.addButton} onClick={handleAddButton}>
            Thêm
          </button>
        </div>
        {/* Nút lưu thông tin */}
        <div className={styles.saveContainer}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isProfileUnchanged}
          >
            Lưu Thông Tin
          </button>
        </div>
      </div>
      <Footer />

      {/* Modal xác nhận địa chỉ mới với map */}
      {showMapConfirmModal && (
        <MapConfirmModal
          address={newAddress}
          onConfirm={confirmAddAddress}
          onCancel={cancelAddAddress}
        />
      )}

      {/* Modal xác nhận đặt mặc định cho địa chỉ đã có */}
      {showDefaultConfirmModal && (
        <ConfirmModal
          message="Bạn có muốn đặt địa chỉ này làm mặc định?"
          onConfirm={confirmSetDefault}
          onCancel={cancelSetDefault}
        />
      )}

      {/* Modal xác nhận xóa địa chỉ */}
      {showDeleteConfirmModal && (
        <ConfirmModal
          message="Bạn có muốn xóa địa chỉ này?"
          onConfirm={confirmDeleteAddress}
          onCancel={cancelDeleteAddress}
        />
      )}
    </div>
  );
}