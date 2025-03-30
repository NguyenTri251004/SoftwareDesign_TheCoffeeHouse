import React, { useState } from 'react';
import styles from './CancelOrder.module.css';
import { FaTimes, FaBell } from 'react-icons/fa';

const CancelOrder = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reasons = [
    'Đặt nhầm sản phẩm',
    'Thời gian chờ quá lâu',
    'Sản phẩm không còn nhu cầu',
    'Vấn đề kỹ thuật khi đặt hàng',
    'Khác'
  ];

  const handleConfirm = () => {
    const finalReason = reason === 'Khác' ? customReason : reason;
    if (finalReason.trim()) {
      onConfirm(finalReason);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
            <div className={styles.title}>
                <FaBell className={styles.icon} />
                <h3>NHẮC NHỞ</h3>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
                <FaTimes />
            </button>
        </div>
        <p className={styles.message}>Bạn chắc chắn muốn huỷ đơn hàng? Nhập lí do bên dưới</p>

        <select
          className={styles.dropdown}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value !== 'Khác') setCustomReason('');
          }}
        >
          <option value="">Lí do huỷ đơn hàng</option>
          {reasons.map((r, idx) => (
            <option key={idx} value={r}>{r}</option>
          ))}
        </select>

        {reason === 'Khác' && (
          <input
            className={styles.input}
            type="text"
            placeholder="Nhập lý do huỷ đơn..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        <button
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={reason === '' || (reason === 'Khác' && !customReason.trim())}
        >
          Xác nhận huỷ
        </button>
      </div>
    </div>
  );
};

export default CancelOrder;