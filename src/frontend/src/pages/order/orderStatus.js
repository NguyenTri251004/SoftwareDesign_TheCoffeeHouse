import React from 'react';
import styles from './orderStatus.module.css';
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaBox, FaTruck } from 'react-icons/fa';
import Header from 'components/header/Header';

const OrderStatus = () => {
  const order = {
    id: '201282023FG0900',
    items: [
      { name: 'A-mê Đào', size: 'Lớn', price: 55000, image: '/images/ame-dao.png' },
      { name: 'Matcha Latte', size: 'Lớn', price: 55000, image: '/images/matcha-latte.png' },
    ],
    deliveryFee: 18000,
    discount: -18000,
    status: [
      { time: '04 Tháng 03 - 11:31 AM', title: 'Đang chuẩn bị hàng', description: 'Đơn hàng của bạn đang được chuẩn bị. Chúng tôi đang pha chế đồ uống thật tươi ngon cho bạn!', icon: <FaBox /> },
      { time: '04 Tháng 03 - 11:47 AM', title: 'Đã giao cho đơn vị vận chuyển', description: 'Đơn hàng đã sẵn sàng và được giao cho đơn vị vận chuyển. Chờ chút nhé, đồ uống của bạn sắp đến rồi!', icon: <FaMapMarkerAlt /> },
      { time: '04 Tháng 03 - 12:01 AM', title: 'Đang vận chuyển', description: 'Tài xế đang trên đường giao hàng. Hãy chuẩn bị nhận đồ uống ngon lành của bạn nhé!', icon: <FaTruck /> },
      { time: '', title: 'Đã nhận hàng', description: 'Cảm ơn bạn đã mua hàng! Chúc bạn thưởng thức đồ uống ngon miệng. Đừng quên đánh giá đơn hàng nhé!', icon: <FaCheckCircle /> },
    ]
  };

  const totalPrice = order.items.reduce((sum, item) => sum + item.price, 0);
  const finalPrice = totalPrice + order.deliveryFee + order.discount;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>Đơn hàng</h2>
        <div className={styles.itemList}>
          {order.items.map((item, index) => (
            <div key={index} className={styles.item}>
              <img src={item.image} alt={item.name} />
              <div>
                <div>{`1 x ${item.name}`}</div>
                <div className={styles.size}>{item.size}</div>
              </div>
              <div>{item.price.toLocaleString()}đ</div>
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
            <span>{order.deliveryFee.toLocaleString()}đ</span>
          </div>
          <div className={styles.row}>
            <span className={styles.strike}>Bạn có mã Freeship</span>
            <span className={styles.strike}>0đ</span>
          </div>
          <div className={styles.discount}>Miễn phí vận chuyển</div>
          <div className={styles.row}>
            <strong>Thành tiền</strong>
            <strong>{finalPrice.toLocaleString()}đ</strong>
          </div>
        </div>
      </div>

      <div className={styles.statusArea}>
        <h3>Mã đơn hàng: <strong>{order.id}</strong></h3>
        <h2>Theo dõi đơn hàng</h2>
        <div className={styles.timeline}>
          {order.status.map((step, index) => (
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
        <button className={styles.disabledButton} disabled>Huỷ đơn hàng</button>
      </div>
    </div>
  );
};

export default OrderStatus;