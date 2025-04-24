import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './TrackOrder.module.css';
import Header from 'components/header/Header';

// Define the API base URL from environment variable or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const TrackOrder = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng nhập số điện thoại
  const handlePhoneChange = (e) => {
    // Chỉ cho phép nhập số
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
  };

  // Hàm xử lý khi người dùng gửi form tra cứu
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone || phone.length < 9) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Đang gửi yêu cầu đến ${API_BASE_URL}/order/track-by-phone với số điện thoại: ${phone}`);
      
      const response = await axios.get(`${API_BASE_URL}/order/track-by-phone`, {
        params: { phone }
      });
      
      console.log('Phản hồi từ server:', response);
      
      if (response.data.success) {
        setOrders(response.data.data);
        setSearched(true);
      } else {
        toast.error(response.data.message || 'Không tìm thấy đơn hàng');
        setOrders([]);
        setSearched(true);
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError(error);
      
      if (error.response) {
        console.log('Chi tiết lỗi response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          toast.error('Không tìm thấy đơn hàng nào với số điện thoại này');
          // Đặt trạng thái searched thành true để hiển thị thông báo không tìm thấy
          setSearched(true);
          setOrders([]);
        } else {
          toast.error(`Lỗi: ${error.response.data?.message || 'Có lỗi xảy ra khi tra cứu đơn hàng'}`);
        }
      } else if (error.request) {
        console.log('Không nhận được phản hồi từ server:', error.request);
        // The request was made but no response was received
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Có lỗi xảy ra khi tra cứu đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm định dạng ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Hàm định dạng trạng thái đơn hàng
  const getStatusText = (status) => {
    const statusMap = {
      'Pending': 'Chờ xác nhận',
      'Confirmed': 'Đã xác nhận',
      'Preparing': 'Đang chuẩn bị',
      'Delivering': 'Đang giao hàng',
      'Delivered': 'Đã giao hàng',
      'Cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  // Hàm điều hướng đến trang chi tiết đơn hàng
  const goToOrderDetail = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Tra cứu đơn hàng</h1>
        <p className={styles.subtitle}>
          Nhập số điện thoại của bạn để kiểm tra trạng thái đơn hàng
        </p>

        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.inputWrapper}>
            <input
              type="tel"
              placeholder="Nhập số điện thoại của bạn"
              value={phone}
              onChange={handlePhoneChange}
              className={styles.phoneInput}
            />
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={loading}
            >
              {loading ? 'Đang tìm...' : 'Tra cứu'}
            </button>
          </div>
        </form>

        {searched && (
          <div className={styles.resultsContainer}>
            {orders.length > 0 ? (
              <>
                <h2 className={styles.resultsTitle}>
                  Tìm thấy {orders.length} đơn hàng
                </h2>
                <div className={styles.ordersList}>
                  {orders.map((order) => (
                    <div 
                      key={order._id} 
                      className={styles.orderCard}
                      onClick={() => goToOrderDetail(order._id)}
                    >
                      <div className={styles.orderHeader}>
                        <span className={styles.orderId}>Mã đơn: #{order._id.slice(-8).toUpperCase()}</span>
                        <span className={`${styles.orderStatus} ${styles[`status_${order.status.toLowerCase()}`]}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className={styles.orderDetails}>
                        <p className={styles.orderDate}>
                          <strong>Ngày đặt:</strong> {formatDate(order.createdAt)}
                        </p>
                        <p className={styles.orderShop}>
                          <strong>Cửa hàng:</strong> {order.shopId?.name || 'N/A'}
                        </p>
                        <p className={styles.orderTotal}>
                          <strong>Tổng tiền:</strong> {order.finalAmount?.toLocaleString()}đ
                        </p>
                      </div>
                      <div className={styles.viewDetailButton}>
                        Xem chi tiết
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noResults}>
                <h2 className={styles.noResultsTitle}>Không tìm thấy đơn hàng</h2>
                <p>Không tìm thấy đơn hàng nào với số điện thoại {phone}</p>
                <p>Vui lòng kiểm tra lại số điện thoại hoặc liên hệ với chúng tôi để được hỗ trợ</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;