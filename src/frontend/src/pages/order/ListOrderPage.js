import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice"; // Import actions từ Redux
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import OrderAPI from "services/orderService";
import userAPI from "services/userService"; // Import userAPI để lấy thông tin user
import styles from "./ListOrderPage.module.css";

function ListOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user); // Lấy thông tin user từ Redux
  const [orders, setOrders] = useState([]); // Khởi tạo orders là mảng rỗng
  const [selectedStatus, setSelectedStatus] = useState("Tất cả đơn hàng");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Danh sách tab trạng thái
  const orderStatuses = [
    "Tất cả đơn hàng",
    "Đang chuẩn bị hàng",
    "Đã giao cho vận chuyển",
    "Đang vận chuyển",
    "Đã nhận hàng",
    "Trả hàng/Hoàn tiền",
  ];

  // Lấy thông tin user giống UserProfile.js
  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Lấy thông tin user nếu chưa có trong Redux
        if (!user?.id) {
          const userData = await userAPI.getProfile();
          if (!userData || !userData.id) {
            throw new Error("Không tìm thấy thông tin người dùng hoặc ID.");
          }
          dispatch(setUser(userData));
        }

        // Lấy danh sách đơn hàng
        const ordersData = await OrderAPI.getOrders();
        console.log("Dữ liệu đơn hàng từ API:", ordersData); // Debug dữ liệu trả về
        // Đảm bảo ordersData là mảng, nếu không thì gán mảng rỗng
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại!");
        if (
          error.message.includes("No token found") ||
          error.message.includes("Invalid or expired token")
        ) {
          localStorage.removeItem("token");
          dispatch(clearUser());
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileAndOrders();
  }, [user, dispatch, navigate]);

  // Hàm lọc đơn hàng theo trạng thái
  const filteredOrders = () => {
    if (!Array.isArray(orders)) {
      return []; // Trả về mảng rỗng nếu orders không phải là mảng
    }
    if (selectedStatus === "Tất cả đơn hàng") {
      return orders;
    }
    return orders.filter((order) => order.status === selectedStatus);
  };

  // Xử lý khi nhấn nút "Chi tiết đơn hàng"
  const handleOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`); // Chuyển hướng đến trang chi tiết đơn hàng
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.content}>
          <p>Đang tải dữ liệu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <div className={styles.errorMessage}>{error}</div>}

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
                  <button
                    className={styles.shopButton}
                    onClick={() => handleOrderDetails(order.id)}
                  >
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
                  <span className={styles.orderStatus}>{order.status}</span>
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