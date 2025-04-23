import React, { useState, useEffect, useCallback, useMemo } from "react";
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
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang chuẩn bị hàng",
    "Đang vận chuyển",
    "Đã nhận hàng",
    "Trả hàng/Hoàn tiền",
  ];

  // Tách hàm fetchProfileAndOrders ra khỏi useEffect và cache lại bằng useCallback
  const fetchProfileAndOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Kiểm tra token trước
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Lấy thông tin user nếu chưa có trong Redux
      let currentUser = user;
      if (!currentUser || !currentUser._id) {
        const userData = await userAPI.getProfile();
        // Kiểm tra nếu userData có id hoặc _id
        if (!userData || (!userData.id && !userData._id)) {
          throw new Error("Không tìm thấy thông tin người dùng hoặc ID.");
        }
        currentUser = userData;
        dispatch(setUser(userData));
      }

      // Lấy danh sách đơn hàng của người dùng dựa theo trạng thái đã chọn
      if (selectedStatus !== "Tất cả đơn hàng") {
        const response = await OrderAPI.getUserOrdersByStatus(selectedStatus);
        if (response.success) {
          setOrders(response.data || []);
        } else {
          console.error("Lỗi khi lọc đơn hàng:", response.message);
          setError(response.message || "Không thể lọc đơn hàng theo trạng thái.");
        }
      } else {
        // Nếu là "Tất cả đơn hàng", lấy tất cả đơn hàng
        const ordersData = await OrderAPI.getUserOrders();
        console.log("Dữ liệu đơn hàng của người dùng:", ordersData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }
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
  }, [user?._id, dispatch, navigate, selectedStatus]); // Thêm selectedStatus vào dependencies

  useEffect(() => {
    fetchProfileAndOrders();
    // useEffect chỉ chạy khi user ID thay đổi hoặc component mount
  }, [fetchProfileAndOrders]);

  // Memoize kết quả lọc đơn hàng để tránh tính toán lại nhiều lần
  const filteredOrdersList = useMemo(() => {
    if (!Array.isArray(orders)) {
      return []; // Trả về mảng rỗng nếu orders không phải là mảng
    }
    
    // Không cần phải lọc thêm ở frontend vì đã lọc ở backend rồi
    return orders;
  }, [orders]);

  // Xử lý khi nhấn nút "Chi tiết đơn hàng"
  const handleOrderDetails = useCallback((orderId) => {
    navigate(`/order-status/${orderId}`); // Sửa lại đường dẫn để khớp với định nghĩa trong App.js
  }, [navigate]);

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
          {filteredOrdersList.length > 0 ? (
            filteredOrdersList.map((order) => (
              <div key={order.id || order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <h3 className={styles.branch}>{order.shopId?.name || "Chi nhánh không xác định"}</h3>
                  <button
                    className={styles.shopButton}
                    onClick={() => handleOrderDetails(order.id || order._id)}
                  >
                    Chi tiết đơn hàng
                  </button>
                </div>

                {order.products && order.products.map((product, idx) => {
                  // Lấy thông tin chi tiết từ dữ liệu đã populate
                  const productDetails = product.productId || {};
                  
                  return (
                    <div key={idx} className={styles.orderItem}>
                      <img
                        src={productDetails.image || ''}
                        alt={productDetails.name || 'Sản phẩm'}
                        className={styles.productImage}
                      />
                      <div className={styles.itemInfo}>
                        <h4 className={styles.productName}>{productDetails.name || 'Không có tên'}</h4>
                        <p className={styles.productDetails}>
                          Size: {product.size || 'S'} 
                          {product.topping && product.topping.length > 0 && ', Topping: ' + 
                            product.topping.map(t => t.toppingId?.name || '').filter(Boolean).join(', ')}
                        </p>
                        <p className={styles.productQuantity}>
                          x{product.amount || 1}
                        </p>
                      </div>
                      <span className={styles.productPrice}>
                        {(product.totalPrice !== undefined ? product.totalPrice : 0).toLocaleString()}đ
                      </span>
                    </div>
                  );
                })}

                {/* Thông tin đơn hàng */}
                <div className={styles.orderFooter}>
                  <span className={styles.orderStatus}>{order.status}</span>
                  <span className={styles.totalPrice}>
                    {(order.finalAmount !== undefined ? order.finalAmount : 0).toLocaleString()}đ
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