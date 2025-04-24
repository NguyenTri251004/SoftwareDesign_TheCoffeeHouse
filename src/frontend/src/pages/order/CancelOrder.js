import React, { useState } from 'react';
import styles from './CancelOrder.module.css';

const CancelOrder = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Vui lòng chọn hoặc nhập lý do hủy đơn hàng');
      return;
    }
    onConfirm(reason);
  };

  const reasons = [
    'Tôi muốn thay đổi đơn hàng',
    'Tôi không muốn đợi lâu',
    'Tôi đặt nhầm đơn',
    'Tôi muốn đổi phương thức thanh toán',
    'Lý do khác'
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Hủy đơn hàng</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            <p>Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng:</p>
            
            {reasons.map((item, index) => (
              <div key={index} className={styles.reasonOption}>
                <input
                  type="radio"
                  id={`reason-${index}`}
                  name="cancelReason"
                  value={item}
                  onChange={() => {
                    setReason(item);
                    setError('');
                  }}
                  checked={reason === item}
                />
                <label htmlFor={`reason-${index}`}>{item}</label>
              </div>
            ))}
            
            {reason === 'Lý do khác' && (
              <textarea
                className={styles.otherReasonInput}
                placeholder="Vui lòng nhập lý do của bạn"
                value={reason === 'Lý do khác' ? '' : reason}
                onChange={(e) => {
                  setReason(e.target.value || 'Lý do khác');
                  setError('');
                }}
              />
            )}
            
            {error && <div className={styles.error}>{error}</div>}
          </div>
          
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Quay lại
            </button>
            <button type="submit" className={styles.confirmButton}>
              Xác nhận hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrder;