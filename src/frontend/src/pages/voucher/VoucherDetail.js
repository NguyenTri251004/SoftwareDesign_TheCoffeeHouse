import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { QRCodeCanvas  } from "qrcode.react";
import VoucherAPI from "services/voucherService";
import styles from "./VoucherDetail.module.css";

// Set root element for accessibility
Modal.setAppElement("#root");

const VoucherDetail = ({ voucherId, isOpen, onRequestClose }) => {
  const [voucherDetail, setVoucherDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (voucherId && isOpen) {
      const fetchVoucherDetail = async () => {
        setLoading(true);
        try {
          const data = await VoucherAPI.getVoucherById(voucherId);
          setVoucherDetail(data);
        } catch (error) {
          console.error("Error fetching voucher detail:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVoucherDetail();
    }
  }, [voucherId, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.voucherDetailContainer}
      overlayClassName={styles.voucherDetailOverlay}
    >
      <div className={styles.detailHeader}>
        <h2>Chi tiết khuyến mãi</h2>
        <button onClick={onRequestClose} className={styles.closeButton}>
          ✖
        </button>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Đang tải thông tin voucher...</p>
      ) : voucherDetail ? (
        <div className={styles.detailContent}>
          {/* Title voucher */}
          <p className={styles.voucherTitle}>{voucherDetail.title}</p>
          {/* Thông tin hết hạn */}
          <p className={styles.voucherExpiry}>
            Hết hạn trong {voucherDetail.expiresIn}
          </p>
          {/* QR Code (icon) */}
          {voucherDetail.code && (
            <div className={styles.qrContainer}>
              <QRCodeCanvas
                value={voucherDetail.code} // Giá trị cần mã hóa thành QR code
                size={150}                 // Kích thước QR code
                level="H"                  // Mức độ chịu lỗi: L, M, Q, H
              />
            </div>
          )}
          {/* <img
            src={voucherDetail.icon}
            alt="Voucher Icon"
            className={styles.voucherIcon}
          /> */}

          {voucherDetail.code && (
            <p className={styles.voucherCode}>
                Mã khuyến mãi: <span>{voucherDetail.code}</span>
            </p>
            )}

          {/* Mô tả voucher */}
          <p className={styles.voucherDescription}>
            {voucherDetail.description}
          </p>
          {/* Link điều khoản nếu có (tuỳ chỉnh) */}
          {voucherDetail.termsLink && (
            <a
              href={voucherDetail.termsLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.termsLink}
            >
              Điều khoản sử dụng
            </a>
          )}
          {/* Footer actions */}
          <div className={styles.voucherActions}>
            <button className={styles.backButton} onClick={onRequestClose}>
              Quay về
            </button>
            <button
              className={styles.useButton}
              onClick={() => {
                // Xử lý logic sử dụng voucher
                console.log("Sử dụng voucher ID:", voucherId);
                onRequestClose();
              }}
            >
              Sử dụng ngay
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.noVoucher}>Không có thông tin voucher.</p>
      )}
    </Modal>
  );
};

export default VoucherDetail;
