import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import styles from './DemoPayment.module.css';
import momoLogo from '../../assets/images/momo-logo.png'; // Sử dụng logo đã tải về trong thư mục assets

const DemoPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Lấy thông tin từ URL
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const extraData = searchParams.get('extraData');
  
  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate(`/payment-result?resultCode=0&orderId=${orderId}&extraData=${extraData}`);
    }, 2000);
  };
  
  const handlePaymentFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate(`/payment-result?resultCode=99&orderId=${orderId}&extraData=${extraData}`);
    }, 2000);
  };
  
  const handleCancel = () => {
    navigate('/checkout');
  };
  
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.paymentCard}>
          <div className={styles.paymentHeader}>
            <img src={momoLogo} alt="MoMo Logo" className={styles.logo} />
            <h2>Thanh toán MoMo Demo</h2>
            <p className={styles.note}>Đây là trang thanh toán MoMo giả lập cho mục đích phát triển</p>
          </div>
          
          <div className={styles.paymentDetails}>
            <div className={styles.detailRow}>
              <span>Mã đơn hàng:</span>
              <span>{orderId}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Số tiền:</span>
              <span className={styles.amount}>{parseInt(amount).toLocaleString()}đ</span>
            </div>
          </div>
          
          {isProcessing ? (
            <div className={styles.processing}>
              <div className={styles.spinner}></div>
              <p>Đang xử lý thanh toán...</p>
            </div>
          ) : (
            <div className={styles.actions}>
              <button 
                className={styles.successButton} 
                onClick={handlePaymentSuccess}
                disabled={isProcessing}
              >
                Thanh toán thành công
              </button>
              <button 
                className={styles.failButton} 
                onClick={handlePaymentFailure}
                disabled={isProcessing}
              >
                Thanh toán thất bại
              </button>
              <button 
                className={styles.cancelButton} 
                onClick={handleCancel}
                disabled={isProcessing}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DemoPayment;