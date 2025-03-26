import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import OrderAPI from "services/orderService"; // import từ services/orderService
import styles from "./ListOrderPage.module.css";

function ListOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả đơn hàng");
//   const navigate = useNavigate();

  // Danh sách tab trạng thái
  const orderStatuses = [
    "Tất cả đơn hàng",
    "Đang chuẩn bị hàng",
    "Đã giao cho vận chuyển",
    "Đang vận chuyển",
    "Đã nhận hàng",
    "Trả hàng/Hoàn tiền"
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await OrderAPI.getOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  // Hàm lọc đơn hàng theo trạng thái
  const filteredOrders = () => {
    if (selectedStatus === "Tất cả đơn hàng") {
      return orders;
    } else {
      return orders.filter((order) => order.status === selectedStatus);
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>

        {/* Tabs trạng thái đơn hàng */}
        <div className={styles.tabs}>
          {orderStatuses.map((status, index) => (
            <div
              key={index}
              className={`${styles.tab} ${
                selectedStatus === status ? styles.activeTab : ""
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </div>
          ))}
        </div>

        {/* Danh sách đơn hàng sau khi lọc */}
        <div className={styles.ordersList}>
          {filteredOrders().length > 0 ? (
            filteredOrders().map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <h3 className={styles.branch}>{order.branch}</h3>
                  <button className={styles.shopButton}>
                    Chi tiết đơn hàng
                  </button>
                </div>

                {order.items.map((item, idx) => (
                  <div key={idx} className={styles.orderItem}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.productImage}
                    />
                    <div className={styles.itemInfo}>
                      <h4 className={styles.productName}>{item.name}</h4>
                      <p className={styles.productDetails}>
                        Phân loại hàng: {item.toppings}
                      </p>
                      <p className={styles.productQuantity}>
                        x{item.quantity}
                      </p>
                    </div>
                    <span className={styles.productPrice}>
                      {item.price.toLocaleString()}đ
                    </span>
                  </div>
                ))}

                {/* Thông tin đơn hàng */}
                <div className={styles.orderFooter}>
                  <span className={`${styles.orderStatus}`}>
                    {order.status}
                  </span>
                  <span className={styles.totalPrice}>
                    {order.totalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noOrders}>Không có đơn hàng nào.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ListOrderPage;
