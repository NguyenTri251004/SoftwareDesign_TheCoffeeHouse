import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import styles from './PaymentResult.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import OrderAPI from 'services/orderService';
import PaymentAPI from 'services/paymentService';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setIsLoading(true);
        
        // Lấy thông tin từ URL
        const params = new URLSearchParams(location.search);
        const resultCode = params.get('resultCode');
        const orderId = params.get('orderId');
        
        if (!resultCode || !orderId) {
          setPaymentStatus('unknown');
          setError("Không tìm thấy thông tin thanh toán");
          setIsLoading(false);
          return;
        }
        
        // Xử lý kết quả thanh toán từ MoMo hoặc demo
        if (resultCode === '0') {
          // Thanh toán thành công
          setPaymentStatus('success');
          
          // Nếu là kết quả từ demo payment, gọi API để cập nhật trạng thái
          if (location.pathname === '/payment-result') {
            try {
              await PaymentAPI.processDemoPayment({
                orderId,
                resultCode
              });
            } catch (err) {
              console.error("Lỗi khi xử lý kết quả thanh toán demo:", err);
            }
          }
          
          // Nếu có extraData, giải mã để lấy orderId gốc
          if (params.get('extraData')) {
            try {
              const extraData = JSON.parse(atob(params.get('extraData')));
              if (extraData.orderId) {
                const orderData = await OrderAPI.getOrderById(extraData.orderId);
                if (orderData && orderData.data) {
                  setOrderDetails(orderData.data);
                }
              }
            } catch (decodeError) {
              console.error('Lỗi khi giải mã extraData:', decodeError);
            }
          }
        } else {
          // Thanh toán thất bại
          setPaymentStatus('failed');
          setError(`Thanh toán thất bại (Mã lỗi: ${resultCode})`);
          
          // Cập nhật trạng thái thanh toán thất bại
          if (location.pathname === '/payment-result') {
            try {
              await PaymentAPI.processDemoPayment({
                orderId,
                resultCode
              });
            } catch (err) {
              console.error("Lỗi khi xử lý kết quả thanh toán demo thất bại:", err);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
        setPaymentStatus('failed');
        setError("Đã xảy ra lỗi khi xử lý kết quả thanh toán");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPaymentStatus();
  }, [location]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    navigate('/order');
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang xử lý kết quả thanh toán...</p>
          </div>
        ) : (
          <div className={styles.resultCard}>
            {paymentStatus === 'success' ? (
              <>
                <FaCheckCircle className={styles.successIcon} />
                <h2>Thanh toán thành công!</h2>
                <p>Cảm ơn bạn đã đặt hàng tại The Coffee House</p>
                {orderDetails && (
                  <div className={styles.orderSummary}>
                    <p>Mã đơn hàng: <strong>{orderDetails._id}</strong></p>
                    <p>Tổng tiền: <strong>{orderDetails.finalAmount?.toLocaleString()}đ</strong></p>
                  </div>
                )}
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.viewOrderButton}
                    onClick={handleViewOrder}
                  >
                    Xem đơn hàng
                  </button>
                  <button
                    className={styles.continueButton}
                    onClick={handleContinueShopping}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </>
            ) : (
              <>
                <FaTimesCircle className={styles.failedIcon} />
                <h2>Thanh toán thất bại</h2>
                <p>{error || "Có lỗi xảy ra trong quá trình thanh toán"}</p>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.retryButton}
                    onClick={() => navigate('/checkout')}
                  >
                    Thử lại
                  </button>
                  <button
                    className={styles.continueButton}
                    onClick={handleContinueShopping}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentResult;