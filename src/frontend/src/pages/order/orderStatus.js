import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './orderStatus.module.css';
import { FaMapMarkerAlt, FaBox, FaTruck } from 'react-icons/fa';
import Header from 'components/header/Header';
import CancelOrder from './CancelOrder';
import axios from 'axios';

const OrderStatus = () => {
  const { orderId } = useParams(); // Extract orderId from URL
  const navigate = useNavigate();

  // Debug: Log the orderId to verify it's being extracted
  console.log('orderId from useParams:', orderId);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    // Check if orderId is undefined or empty
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng trong URL. Vui lòng kiểm tra lại đường dẫn.');
      setLoading(false);
      navigate('/orders'); // Redirect to a page listing orders (adjust path as needed)
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/order/${orderId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Check if the API response indicates success
        if (!response.data.success) {
          throw new Error(response.data.message || 'Không thể tải thông tin đơn hàng');
        }

        // Set the order data from the response
        const orderData = response.data.data;

        // Validate that products array exists and has populated data
        // if (!orderData.products || !orderData.products.every(item => item.productId && item.productId.name)) {
        //   throw new Error('Dữ liệu đơn hàng không đầy đủ. Vui lòng liên hệ hỗ trợ.');
        // }

        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin đơn hàng.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  // Map status to timeline steps
  const getStatusTimeline = (status, createdAt) => {
    const baseTime = new Date(createdAt);
    const timeline = [];

    if (status === 'Pending' || status === 'Confirmed' || status === 'Preparing' || status === 'Delivered' || status === 'Cancelled') {
      timeline.push({
        time: formatDate(baseTime),
        title: 'Đang chuẩn bị hàng',
        description: 'Đơn hàng của bạn đang được chuẩn bị. Chúng tôi đang pha chế đồ uống thật tươi ngon cho bạn!',
        icon: <FaBox />,
      });
    }

    if (status === 'Preparing' || status === 'Delivered') {
      baseTime.setMinutes(baseTime.getMinutes() + 16);
      timeline.push({
        time: formatDate(baseTime),
        title: 'Đã giao cho đơn vị vận chuyển',
        description: 'Đơn hàng đã sẵn sàng và được giao cho đơn vị vận chuyển. Chờ chút nhé, đồ uống của bạn sắp đến rồi!',
        icon: <FaMapMarkerAlt />,
      });
    }

    if (status === 'Delivered') {
      baseTime.setMinutes(baseTime.getMinutes() + 14);
      timeline.push({
        time: formatDate(baseTime),
        title: 'Đang vận chuyển',
        description: 'Tài xế đang trên đường giao hàng. Hãy chuẩn bị nhận đồ uống ngon lành của bạn nhé!',
        icon: <FaTruck />,
      });
    }

    if (status === 'Cancelled') {
      timeline.push({
        time: formatDate(baseTime),
        title: 'Đơn hàng đã bị hủy',
        description: 'Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ hỗ trợ nếu cần thêm thông tin.',
        icon: <FaBox />,
      });
    }

    return timeline;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle loading and error states
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  // Calculate prices
  const totalPrice = order.products.reduce((total, item) => total + item.totalPrice, 0);
  const finalPrice = totalPrice + order.shippingFee - order.discount;

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <h2>Đơn hàng</h2>
          <div className={styles.itemList}>
            {order.products.map((item, index) => (
              <div key={index} className={styles.item}>
                <img
                  src={item.productId.image || '/images/placeholder.png'}
                  alt={item.productId.name}
                />
                <div className={styles.drinkDetails}>
                  <div>{`${item.amount} x ${item.productId.name}`}</div>
                  <div className={styles.size}>{item.size}</div>
                </div>
                <div>{item.totalPrice.toLocaleString()}đ</div>
              </div>
            ))}
          </div>
          <div className={styles.summary}>
            <div className={styles.row}>
              <span>Thành tiền</span>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div className={styles.row}>
              <span>Phí giao hàng</span>
              <span>{order.shippingFee.toLocaleString()}đ</span>
            </div>
            {order.discount > 0 && (
              <>
                <div className={styles.row}>
                  <span className={styles.strike}>Bạn có mã Freeship</span>
                  <span className={styles.strike}>0đ</span>
                </div>
                <div className={styles.discount}>Miễn phí vận chuyển</div>
              </>
            )}
            <div className={styles.row}>
              <strong>Thành tiền</strong>
              <strong>{finalPrice.toLocaleString()}đ</strong>
            </div>
          </div>
        </div>

        <div className={styles.statusArea}>
          <div className={styles.header}>
            <h2>Theo dõi đơn hàng</h2>
            <h3>
              Mã đơn hàng: <strong>{order._id}</strong>
            </h3>
          </div>
          <div className={styles.timeline}>
            {getStatusTimeline(order.status, order.createdAt).map((step, index) => (
              <div className={styles.step} key={index}>
                <div className={styles.icon}>{step.icon}</div>
                <div className={styles.details}>
                  <div className={styles.time}>{step.time}</div>
                  <div className={styles.title}>{step.title}</div>
                  <div className={styles.desc}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            {order.status === 'Delivered' && (
              <button className={styles.primaryButton}>Đã nhận hàng</button>
            )}
            {['Pending', 'Confirmed', 'Preparing'].includes(order.status) && (
              <button
                className={styles.primaryButton}
                onClick={() => setShowCancelModal(true)}
              >
                Huỷ đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>
      {showCancelModal && (
        <CancelOrder
          onClose={() => setShowCancelModal(false)}
          onConfirm={async (reason) => {
            setCancelReason(reason);
            setShowCancelModal(false);
            try {
              // Note: Backend doesn't have this endpoint yet; this will fail
              const response = await axios.post(`/api/orders/${orderId}/cancel`, { reason });
              if (!response.data.success) {
                throw new Error(response.data.message || 'Không thể hủy đơn hàng');
              }
              alert(`Huỷ đơn hàng với lý do: ${reason}`);
              // Refetch the order to update the UI
              const updatedOrderResponse = await axios.get(`/api/orders/${orderId}`);
              if (updatedOrderResponse.data.success) {
                setOrder(updatedOrderResponse.data.data);
              }
            } catch (err) {
              alert(err.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.');
            }
          }}
        />
      )}
    </div>
  );
};

export default OrderStatus;