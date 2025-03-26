import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { usePopup } from "context/PopupContext";
import VoucherAPI from "services/voucherService";
import VoucherDetail from "./VoucherDetail"; // Import component
import styles from "./VoucherPage.module.css";

// Set root element for accessibility
Modal.setAppElement("#root");

const VoucherPage = () => {
  const { isOpen, openPopup, closePopup } = usePopup(); 
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State để quản lý voucher đang được chọn và popup chi tiết
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [isVoucherDetailOpen, setIsVoucherDetailOpen] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          const data = await VoucherAPI.getVouchers();
          setVouchers(data);
        } catch (error) {
          console.error("Error loading vouchers:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchVouchers();
  }, [isOpen]);

  // Mở VoucherDetail => Đóng VoucherPage
  const handleUseVoucher = (voucherId) => {
    setSelectedVoucherId(voucherId);
    closePopup();            // Đóng popup VoucherPage
    setIsVoucherDetailOpen(true); // Mở popup VoucherDetail
  };

  // Đóng VoucherDetail => Mở lại VoucherPage
  const closeVoucherDetail = () => {
    setIsVoucherDetailOpen(false); 
    openPopup();             // Mở lại popup VoucherPage
    setSelectedVoucherId(null);
  };

  return (
    <>
      {/* Popup danh sách voucher */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closePopup}
        className={styles.voucherContainer}
        overlayClassName={styles.voucherOverlay}
      >
        <div className={styles.voucherHeader}>
          <h2>Khuyến mãi</h2>
          <button className={styles.closeButton} onClick={closePopup}>✖</button>
        </div>

        <div className={styles.inputContainer}>
          <input type="text" placeholder="Nhập mã khuyến mãi" />
          <button className={styles.applyButton}>Áp dụng</button>
        </div>

        <h3 className={styles.sectionTitle}>Sắp hết hạn</h3>

        {loading ? (
          <p className={styles.loadingText}>Đang tải...</p>
        ) : vouchers.length > 0 ? (
          <div className={styles.voucherList}>
            {vouchers.map((voucher) => (
              <div key={voucher.id} className={styles.voucherItem}>
                <div>
                  <img
                    src={voucher.icon}
                    className={styles.voucherIcon}
                    alt="Voucher Icon"
                  />
                </div>
                <div className={styles.voucherDetails}>
                  <p className={styles.voucherTitle}>{voucher.title}</p>
                  <p className={styles.voucherExpiry}>
                    Hết hạn trong {voucher.expiresIn}
                  </p>
                  <p
                    className={styles.useButton}
                    onClick={() => handleUseVoucher(voucher.id)}
                  >
                    Sử dụng ngay
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noVoucher}>Không có voucher nào.</p>
        )}
      </Modal>

      {/* Popup chi tiết voucher */}
      <VoucherDetail
        voucherId={selectedVoucherId}
        isOpen={isVoucherDetailOpen}
        onRequestClose={closeVoucherDetail}
      />
    </>
  );
};

export default VoucherPage;
