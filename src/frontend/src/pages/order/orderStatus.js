import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './orderStatus.module.css';
import { FaMapMarkerAlt, FaBox, FaTruck } from 'react-icons/fa';
import Header from 'components/header/Header';
import CancelOrder from './CancelOrder';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderStatus = () => {
  const { orderId } = useParams(); // Extract orderId from URL
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Fetch the order data
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
      setOrder(orderData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin đơn hàng.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if orderId is undefined or empty
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng trong URL. Vui lòng kiểm tra lại đường dẫn.');
      setLoading(false);
      navigate('/orders'); // Redirect to a page listing orders (adjust path as needed)
      return;
    }

    fetchOrder();
  }, [orderId, navigate]);

  // Handle order cancellation
  const handleCancelOrder = async (reason) => {
    setCancelLoading(true);
    try {
      const response = await axios.put(`http://localhost:5001/api/order/${orderId}/cancel`, 
        { reason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể hủy đơn hàng');
      }

      toast.success('Đơn hàng đã được hủy thành công');
      // Refresh order data to reflect the new status
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Map status to timeline steps
  const getStatusTimeline = (status, createdAt) => {
    let timeline = []; // Thay đổi từ const sang let để có thể gán lại biến này
    const statusTimes = order.statusTimes || {};
    
    // Định nghĩa các trạng thái theo thứ tự xử lý
    const allStatuses = ['Pending', 'Confirmed', 'Preparing', 'Delivering', 'Delivered'];
    
    // Xác định vị trí của trạng thái hiện tại trong quy trình
    const currentStatusIndex = allStatuses.indexOf(status);
    
    // Step 1: Order received - shown for all orders
    timeline.push({
      time: formatDate(new Date(createdAt)),
      title: 'Đã nhận đơn hàng',
      description: 'Đơn hàng của bạn đã được tiếp nhận thành công.',
      icon: <FaBox />,
      active: true,
      completed: true
    });

    // Step 2: Confirmed order
    if (statusTimes.confirmed) {
      timeline.push({
        time: formatDate(new Date(statusTimes.confirmed)),
        title: 'Đã xác nhận đơn hàng',
        description: 'Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ chuẩn bị ngay!',
        icon: <FaBox />,
        active: true,
        completed: true
      });
    } else {
      timeline.push({
        time: 'Đang chờ',
        title: 'Xác nhận đơn hàng',
        description: 'Đơn hàng của bạn đang chờ xác nhận.',
        icon: <FaBox />,
        active: currentStatusIndex >= 1, // Chỉ active nếu đã đạt trạng thái này
        completed: false,
        pending: true
      });
    }

    // Step 3: Preparing order
    if (statusTimes.preparing) {
      timeline.push({
        time: formatDate(new Date(statusTimes.preparing)),
        title: 'Đang chuẩn bị hàng',
        description: 'Đơn hàng của bạn đang được chuẩn bị. Chúng tôi đang pha chế đồ uống thật tươi ngon cho bạn!',
        icon: <FaBox />,
        active: true,
        completed: true
      });
    } else {
      timeline.push({
        time: 'Đang chờ',
        title: 'Chuẩn bị đơn hàng',
        description: 'Đơn hàng của bạn sẽ được chuẩn bị sau khi xác nhận.',
        icon: <FaBox />,
        active: currentStatusIndex >= 2, // Chỉ active nếu đã đạt trạng thái này
        completed: false,
        pending: true
      });
    }

    // Step 4: Delivering order
    if (statusTimes.delivering) {
      timeline.push({
        time: formatDate(new Date(statusTimes.delivering)),
        title: 'Đang giao hàng',
        description: 'Tài xế đang trên đường giao hàng. Hãy chuẩn bị nhận đồ uống ngon lành của bạn nhé!',
        icon: <FaTruck />,
        active: true,
        completed: true
      });
    } else {
      timeline.push({
        time: 'Đang chờ',
        title: 'Giao hàng',
        description: 'Đơn hàng sẽ được giao sau khi hoàn tất chuẩn bị.',
        icon: <FaTruck />,
        active: currentStatusIndex >= 3, // Chỉ active nếu đã đạt trạng thái này
        completed: false,
        pending: true
      });
    }

    // Step 5: Delivered
    if (statusTimes.delivered) {
      timeline.push({
        time: formatDate(new Date(statusTimes.delivered)),
        title: 'Đã giao hàng',
        description: 'Đơn hàng đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!',
        icon: <FaMapMarkerAlt />,
        active: true,
        completed: true
      });
    } else {
      timeline.push({
        time: 'Đang chờ',
        title: 'Giao hàng thành công',
        description: 'Thông báo khi đơn hàng được giao thành công.',
        icon: <FaMapMarkerAlt />,
        active: currentStatusIndex >= 4, // Chỉ active nếu đã đạt trạng thái này
        completed: false,
        pending: true
      });
    }

    // If order was cancelled, replace with cancellation timeline
    if (status === 'Cancelled') {
      const cancelTime = statusTimes.cancelled || new Date();
      timeline = [{
        time: formatDate(new Date(createdAt)),
        title: 'Đã nhận đơn hàng',
        description: 'Đơn hàng của bạn đã được tiếp nhận thành công.',
        icon: <FaBox />,
        active: true,
        completed: true
      }, {
        time: formatDate(new Date(cancelTime)),
        title: 'Đơn hàng đã bị hủy',
        description: 'Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ hỗ trợ nếu cần thêm thông tin.',
        icon: <FaBox />,
        active: true,
        completed: true,
        cancelled: true
      }];
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

  // Check if order can be cancelled
  const canCancel = ['Pending', 'Confirmed', 'Preparing'].includes(order.status);

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
            {order.status === 'Cancelled' && (
              <div className={styles.cancelledBadge}>
                Đã hủy
              </div>
            )}
          </div>
          <div className={styles.timeline}>
            {getStatusTimeline(order.status, order.createdAt).map((step, index) => (
              <div 
                className={`${styles.step} ${step.pending ? styles.pending : ''} ${step.cancelled ? styles.cancelled : ''}`} 
                key={index}
              >
                <div className={`${styles.icon} ${step.completed ? styles.completedIcon : ''} ${step.pending ? styles.pendingIcon : ''} ${step.cancelled ? styles.cancelledIcon : ''}`}>
                  {step.icon}
                </div>
                <div className={styles.details}>
                  <div className={styles.time}>{step.time}</div>
                  <div className={`${styles.title} ${step.pending ? styles.pendingText : ''} ${step.cancelled ? styles.cancelledText : ''}`}>
                    {step.title}
                  </div>
                  <div className={styles.desc}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            {order.status === 'Delivered' && (
              <button className={styles.primaryButton}>Đã nhận hàng</button>
            )}
            {canCancel && (
              <button
                className={styles.cancelButton}
                onClick={() => setShowCancelModal(true)}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Đang xử lý...' : 'Huỷ đơn hàng'}
              </button>
            )}
            {order.status === 'Cancelled' && order.cancelReason && (
              <div className={styles.cancelReason}>
                <strong>Lý do hủy:</strong> {order.cancelReason}
              </div>
            )}
          </div>
        </div>
      </div>
      {showCancelModal && (
        <CancelOrder
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default OrderStatus;