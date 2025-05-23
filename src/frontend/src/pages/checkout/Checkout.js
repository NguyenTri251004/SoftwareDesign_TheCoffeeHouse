import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from "../../redux/userSlice";
import styles from './Checkout.module.css';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { FaFile, FaTrashAlt } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { SiGooglemaps } from 'react-icons/si';
import AddressMap from '../../components/map/AddressMap';
import OrderAPI from 'services/orderService';
import userAPI from "services/userService";
import PaymentAPI from "services/paymentService";
import CartAPI from 'services/cartService';

const PaymentMethods = [
  { id: 'cash', label: 'Tiền mặt' },
  { id: 'vnpay', label: 'VNPAY' },
  { id: 'momo', label: 'MoMo' },
  { id: 'zalopay', label: 'ZaloPay' },
  { id: 'shopeepay', label: 'ShopeePay' },
  { id: 'card', label: 'Thẻ ngân hàng' },
];

// Hàm tạo uniqueId dựa trên productId, size và topping
const generateUniqueId = (item) => {
  const toppingStr = item.topping || item.toppings
    ? (item.topping || item.toppings)
        .map((t) => `${t.toppingId}:${t.quantity}`)
        .sort()
        .join('|')
    : '';
  return `${item.productId}-${item.size}-${toppingStr}`;
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [products, setProducts] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showModal, setShowModal] = useState(false);
  const [modalAddress, setModalAddress] = useState('');
  const [showMapInModal, setShowMapInModal] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [storeCoordinates, setStoreCoordinates] = useState({ lat: 10.762622, lon: 106.660172 });
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const discount = 0;

  const SHIPPING_RATE = 5000;

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const isCustomer = localStorage.getItem('role') === 'customer';

        if (isCustomer) {
          let userData = user;
          if (!userData?.id) {
            userData = await userAPI.getProfile();
            dispatch(setUser(userData));
          }
          setRecipientName(userData.fullname || '');
          setPhone(userData.phone || '');
          const defaultAddress = userData.addresses?.find(addr => addr.isDefault)?.address || localStorage.getItem('userAddress') || '';
          setDeliveryAddress(defaultAddress);
          setModalAddress(defaultAddress);
          setEditMode(false);
        } else {
          const savedAddress = localStorage.getItem('userAddress') || '';
          setDeliveryAddress(savedAddress);
          setModalAddress(savedAddress);
          setRecipientName(localStorage.getItem('guestName') || '');
          setPhone(localStorage.getItem('guestPhone') || '');
          setEditMode(true);
        }

        const savedCart = JSON.parse(localStorage.getItem('selectedCart')) || [];
        setProducts(savedCart);

        const shopId = localStorage.getItem("currentShopId");
        if (shopId) {
          const storedCoordinates = localStorage.getItem(`shop_${shopId}_coordinates`);
          if (storedCoordinates) {
            setStoreCoordinates(JSON.parse(storedCoordinates));
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
        setError(error.message);
        if (
          error.message.includes("No token found") ||
          error.message.includes("Invalid or expired token")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          dispatch(clearUser());
        } else if (error.message.includes("Tọa độ cửa hàng không hợp lệ")) {
          navigate("/stores");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndCart();
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (deliveryAddress) {
      calculateDeliveryFee(deliveryAddress);
    } else {
      setShippingFee(15000);
      setDeliveryDistance(0);
    }
  }, [deliveryAddress]);

  const calculateDeliveryFee = async (address) => {
    if (!address || !storeCoordinates?.lat || !storeCoordinates?.lon) {
      setShippingFee(15000);
      setDeliveryDistance(0);
      return;
    }

    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        { headers: { 'User-Agent': 'TheCoffeeHouse/1.0' } }
      );
      const nomData = await nomRes.json();

      if (nomData.length === 0) {
        setError('Không tìm thấy địa chỉ. Vui lòng nhập địa chỉ hợp lệ.');
        setShippingFee(15000);
        setDeliveryDistance(0);
        return;
      }

      const { lat, lon } = nomData[0];
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lon);

      const osrmRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${storeCoordinates.lon},${storeCoordinates.lat};${userLon},${userLat}?overview=false`
      );
      const osrmData = await osrmRes.json();

      if (!osrmData.routes || osrmData.routes.length === 0) {
        setError('Không thể tính khoảng cách giao hàng. Vui lòng thử lại.');
        setShippingFee(15000);
        setDeliveryDistance(0);
        return;
      }

      const distanceInKm = osrmData.routes[0].distance / 1000;
      setDeliveryDistance(distanceInKm);

      const fee = Math.ceil(distanceInKm * SHIPPING_RATE / 1000) * 1000;
      setShippingFee(fee);

      setRouteInfo(osrmData.routes[0]);

      console.log(`Khoảng cách: ${distanceInKm.toFixed(2)}km, Phí giao hàng: ${fee.toLocaleString()}đ`);
    } catch (error) {
      console.error('Lỗi khi tính phí giao hàng:', error);
      setError('Lỗi khi tính phí giao hàng. Vui lòng thử lại.');
      setShippingFee(15000);
      setDeliveryDistance(0);
    }
  };

  const totalAmount = products.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalAmount = totalAmount + shippingFee - discount;

  const showModalAddress = () => {
    setModalAddress(deliveryAddress);
    setShowModal(true);
  };

  const closeModalAddress = () => {
    setShowModal(false);
    setShowMapInModal(false);
    setRouteInfo(null);
  };

  const confirmModalAddress = () => {
    if (!modalAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }
    setDeliveryAddress(modalAddress);
    localStorage.setItem('userAddress', modalAddress);
    localStorage.setItem('deliveryAddress', modalAddress);
    calculateDeliveryFee(modalAddress);
    closeModalAddress();
  };

  const handleUseMap = async () => {
    if (!modalAddress) {
      alert('Vui lòng chọn hoặc nhập địa chỉ!');
      return;
    }

    if (!storeCoordinates || !storeCoordinates.lat || !storeCoordinates.lon) {
      alert('Không có thông tin tọa độ cửa hàng. Vui lòng chọn cửa hàng trước.');
      return;
    }

    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(modalAddress)}`,
        { headers: { 'User-Agent': 'TheCoffeeHouse/1.0' } }
      );
      const nomData = await nomRes.json();
      if (nomData.length > 0) {
        const { lat, lon } = nomData[0];
        const userLat = parseFloat(lat);
        const userLon = parseFloat(lon);
        const osrmRes = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${storeCoordinates.lon},${storeCoordinates.lat};${userLon},${userLat}?overview=false`
        );
        const osrmData = await osrmRes.json();
        if (osrmData.routes && osrmData.routes.length > 0) {
          const distanceInKm = osrmData.routes[0].distance / 1000;
          setDeliveryDistance(distanceInKm);

          const fee = Math.ceil(distanceInKm * SHIPPING_RATE / 1000) * 1000;
          setShippingFee(fee);

          setRouteInfo(osrmData.routes[0]);
        }
        setShowMapInModal(true);
      } else {
        alert('Không tìm thấy địa chỉ, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi tính khoảng cách:', error);
      alert('Có lỗi khi tính khoảng cách. Vui lòng thử lại.');
    }
  };

  const validateInputs = () => {
    if (!recipientName.trim()) {
      return "Tên người nhận không được để trống!";
    }
    if (!phone.trim() || !/^\d{10,11}$/.test(phone)) {
      return "Số điện thoại phải có 10-11 chữ số!";
    }
    if (!deliveryAddress.trim()) {
      return "Địa chỉ giao hàng không được để trống!";
    }
    if (products.length === 0) {
      return "Giỏ hàng trống, không thể đặt hàng!";
    }
    if (localStorage.getItem('role') !== 'customer' && paymentMethod !== 'cash') {
      return "Khách vãng lai chỉ có thể thanh toán bằng tiền mặt!";
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validateInputs();
    if (validationError) {
      alert(validationError);
      return;
    }

    const isCustomer = localStorage.getItem('role') === 'customer';
    const shopId = localStorage.getItem("currentShopId") || "67e832a5d0be3d6ab71556a0";

    if (!isCustomer) {
      localStorage.setItem('guestName', recipientName);
      localStorage.setItem('guestPhone', phone);
      localStorage.setItem('userAddress', deliveryAddress);
    }

    const orderPayload = {
      userId: isCustomer ? user.id : null,
      userName: recipientName,
      shopId,
      deliveryAddress,
      phone,
      status: 'Pending',
      refundStatus: 'None',
      products: products.map((p) => ({
        productId: p.productId,
        size: p.size,
        amount: p.quantity,
        unitPrice: p.unitPrice,
        totalPrice: p.totalPrice,
        topping: p.topping?.map((t) => ({ toppingId: t.toppingId, quantity: t.quantity })) || [],
      })),
      totalAmount,
      shippingFee,
      discount,
      finalAmount,
      note,
      paymentMethod,
      isGuest: !isCustomer,
    };

    try {
      setIsLoading(true);
      setError(null);
      const res = await OrderAPI.postOrder(orderPayload);

      if (res && res.success !== false) {
        // Xóa các sản phẩm được chọn khỏi giỏ hàng
        if (isCustomer && user?.id) {
          try {
            const cartData = await CartAPI.getCartByUserId(user.id);
            const selectedUniqueIds = products.map((p) => p.uniqueId);
            const indicesToRemove = cartData.items
              .map((item, index) => {
                const itemUniqueId = generateUniqueId(item);
                return selectedUniqueIds.includes(itemUniqueId) ? index : -1;
              })
              .filter((index) => index !== -1)
              .sort((a, b) => b - a); // Sắp xếp giảm dần để xóa từ cuối lên đầu

            for (const index of indicesToRemove) {
              await CartAPI.removeFromCart(user.id, index);
            }
          } catch (cartError) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng trên backend:", cartError);
            setError("Đặt hàng thành công nhưng không thể cập nhật giỏ hàng. Vui lòng kiểm tra lại.");
          }
        } else {
          const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
          const selectedUniqueIds = products.map((p) => p.uniqueId);
          const updatedCart = currentCart.filter((item) => {
            const itemUniqueId = generateUniqueId(item);
            return !selectedUniqueIds.includes(itemUniqueId);
          });
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }

        // Xóa selectedCart
        localStorage.removeItem('selectedCart');
        setProducts([]);

        if (paymentMethod === 'momo' && !isCustomer) {
          alert("Khách vãng lai chỉ có thể thanh toán bằng tiền mặt.");
          navigate('/');
          return;
        }

        if (paymentMethod === 'momo') {
          try {
            const paymentRes = await PaymentAPI.createMomoPayment({
              orderId: res.data._id,
              amount: finalAmount,
              orderInfo: `Thanh toán đơn hàng The Coffee House #${res.data._id}`,
            });

            if (paymentRes.success) {
              window.location.href = paymentRes.paymentUrl;
            } else {
              alert(paymentRes.message || "Không thể tạo thanh toán MoMo. Đơn hàng đã được đặt nhưng cần thanh toán sau.");
              navigate(isCustomer ? '/order' : '/');
            }
          } catch (paymentError) {
            console.error("Lỗi khi tạo thanh toán MoMo:", paymentError);
            alert("Đơn hàng đã được đặt thành công nhưng không thể tạo thanh toán MoMo. Vui lòng thanh toán sau.");
            navigate(isCustomer ? '/order' : '/');
          }
        } else {
          alert('Đặt hàng thành công!');
          navigate(isCustomer ? '/order' : '/');
        }
      } else {
        throw new Error(res.message || 'Đặt hàng thất bại.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.message.includes("Dữ liệu đơn hàng không hợp lệ")) {
        setError("Dữ liệu đơn hàng không hợp lệ. Vui lòng kiểm tra lại thông tin và thử lại.");
      } else {
        setError('Đặt hàng thất bại: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = () => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa đơn hàng này không?');
    if (confirmDelete) {
      localStorage.removeItem('selectedCart');
      localStorage.removeItem('cart');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('deliveryAddress');
      setProducts([]);
      setDeliveryAddress('');
      navigate('/');
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const availablePaymentMethods = localStorage.getItem('role') === 'customer'
    ? PaymentMethods
    : PaymentMethods.filter((method) => method.id === 'cash');

  if (isLoading) {
    return (
      <div className={styles.checkoutContainer}>
        <Header />
        <div className={styles.checkoutContent}>
          <p>Đang tải dữ liệu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <Header />
      <div className={styles.checkoutContent}>
        <h2 className={styles.title}>
          <FaFile color="orange" /> Xác nhận đơn hàng
        </h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.orderContainer}>
          <div className={styles.shippingSection}>
            <div className={styles.sectionHeader}>
              <h3>Thông tin giao hàng</h3>
              {localStorage.getItem('role') === 'customer' && (
                <button className={styles.editButton} onClick={handleEditToggle}>
                  {editMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                </button>
              )}
            </div>
            <div className={styles.addressBox}>
              <div className={styles.addressContent}>
                <img
                  src="https://minio.thecoffeehouse.com/images/tch-web-order/Delivery2.png"
                  alt="Delivery Icon"
                  className={styles.deliveryIcon}
                />
                <div className={styles.addressText}>
                  <p>
                    <strong>{deliveryAddress || 'Chưa chọn địa chỉ'}</strong>
                  </p>
                  <p>{deliveryAddress || 'Vui lòng chọn địa chỉ giao hàng'}</p>
                </div>
                <span className={styles.arrowIcon} onClick={showModalAddress}>
                  <IoIosArrowForward />
                </span>
              </div>
            </div>
            <div className={styles.field}>
              <label>Tên người nhận: </label>
              {editMode || localStorage.getItem('role') !== 'customer' ? (
                <input
                  type="text"
                  className={styles.inputField}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Nhập tên người nhận"
                />
              ) : (
                <span>{' ' + recipientName || 'Chưa có thông tin'}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Số điện thoại: </label>
              {editMode || localStorage.getItem('role') !== 'customer' ? (
                <input
                  type="text"
                  className={styles.inputField}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <span>{' ' + phone || 'Chưa có thông tin'}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Ghi chú thêm (nếu có): </label>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Thêm ghi chú (nếu có)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <h3 className={styles.sectionHeader}>Phương thức thanh toán</h3>
            <div className={styles.paymentMethods}>
              {availablePaymentMethods.map((method) => (
                <div key={method.id}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      disabled={isLoading}
                    />
                    <img
                      className={styles.paymentIcon}
                      src={
                        method.id === 'cash'
                          ? 'https://minio.thecoffeehouse.com/image/tchmobileapp/1000_photo_2021-04-06_11-17-08.jpg'
                          : method.id === 'vnpay'
                          ? 'https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg'
                          : method.id === 'momo'
                          ? 'https://i.pinimg.com/736x/dd/28/7d/dd287d17f1d0d43f69f3f4373df70cc5.jpg'
                          : method.id === 'zalopay'
                          ? 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgumCewiq6XqWwa4PkX7fLDKGEWOOVdksz180lH7NNEI4Mw5ArNn1aLKbLyEKy3UOuDupIhTvyNGiSyKEdmL7iPq3Ja667bo2umKl_LnnGQMdkuUl602_rLA4MgtwThR5pSDEKHRf44TFRHY_g6-nYHxs4pss-aB8JZdLMuTvlvW14-16Co-uCw8tRu/s72-c/ZaloPay.jpg'
                          : method.id === 'shopeepay'
                          ? 'https://shopeepay.vn/static/media/shopeePayLogo2022.67d2e522e841720cf971c77142ace5e4.svg'
                          : 'https://minio.thecoffeehouse.com/image/tchmobileapp/385_ic_atm@3x.png'
                      }
                      alt={method.label}
                    />
                    <span>{method.label}</span>
                  </label>
                  <hr className={styles.divider} />
                </div>
              ))}
            </div>
            <div className={styles.terms}>
              <input type="checkbox" defaultChecked disabled={isLoading} />
              <span>
                Đồng ý với các{' '}
                <a href="#" target="_blank" rel="noreferrer">
                  điều khoản và điều kiện
                </a>{' '}
                mua hàng của The Coffee House
              </span>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.orderSummaryDetail}>
              <div className={styles.headerRow}>
                <h3 className={styles.sectionHeader}>Các món đã chọn</h3>
                <button className={styles.addMoreButton}>Thêm món</button>
              </div>
              {products.length === 0 ? (
                <p>Chưa có sản phẩm nào trong đơn hàng.</p>
              ) : (
                products.map((item, index) => (
                  <div key={item.uniqueId || index} className={styles.orderItem}>
                    <div className={styles.orderItemContent}>
                      <MdEdit className={styles.editIcon} />
                      <div className={styles.orderItemContentDetail}>
                        <p className={styles.drinkName}>
                          <strong>
                            {item.quantity} x {item.name || 'Sản phẩm'} ({item.size})
                          </strong>
                        </p>
                        <ul>
                          {item.topping && item.topping.length > 0 ? (
                            item.topping.map((t, i) => (
                              <li key={i}>{t.name} (x{t.quantity})</li>
                            ))
                          ) : (
                            <li>Không có topping</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <p className={styles.price}>{item.totalPrice.toLocaleString()}đ</p>
                  </div>
                ))
              )}
              <h3 className={styles.sectionHeader}>Tổng cộng</h3>
              <div className={styles.summaryRow}>
                <p>Thành tiền</p>
                <p className={styles.price}>{totalAmount.toLocaleString()}đ</p>
              </div>
              <hr className={styles.divider} />
              <div className={styles.summaryRow}>
                <p>Phí giao hàng {deliveryDistance > 0 ? `(${deliveryDistance.toFixed(1)}km)` : ''}</p>
                <p className={styles.price}>{shippingFee.toLocaleString()}đ</p>
              </div>
              <hr className={styles.divider} />
              <div className={styles.summaryRow}>
                <p>Khuyến mãi</p>
                <p className={styles.price}>-{discount.toLocaleString()}đ</p>
              </div>
            </div>

            <div className={styles.totalSection}>
              <div className={styles.totalDetails}>
                <h3 className={styles.sectionTotal}>Thành tiền</h3>
                <p className={styles.sectionPrice}>{finalAmount.toLocaleString()}đ</p>
              </div>
              <button className={styles.confirmButton} onClick={handlePlaceOrder} disabled={isLoading}>
                Đặt hàng
              </button>
            </div>

            <button className={styles.cancelButton} onClick={handleDeleteOrder} disabled={isLoading}>
              <FaTrashAlt role="img" aria-label="trash" />
              <span>Xóa đơn hàng</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <button className={styles.closeButton} onClick={closeModalAddress}>
                x
              </button>
              <span>Giao hàng</span>
            </div>
            <div className={styles.modalContent}>
              {localStorage.getItem('role') === 'customer' && user?.addresses && user.addresses.length > 0 ? (
                <select
                  value={modalAddress}
                  onChange={(e) => setModalAddress(e.target.value)}
                  disabled={isLoading}
                  className={styles.inputField}
                >
                  <option value="">Chọn địa chỉ giao hàng</option>
                  {user.addresses.map((addr, index) => (
                    <option key={index} value={addr.address}>
                      {addr.address} {addr.isDefault ? "(Mặc định)" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <p>Nhập địa chỉ giao hàng:</p>
                  <input
                    type="text"
                    className={styles.inputField}
                    value={modalAddress}
                    onChange={(e) => setModalAddress(e.target.value)}
                    placeholder="Nhập địa chỉ giao hàng"
                    disabled={isLoading}
                  />
                </div>
              )}
              <button className={styles.locationButton} onClick={handleUseMap} disabled={isLoading}>
                <span className={styles.locationIcon}>
                  <SiGooglemaps />
                </span>
                Dùng định vị bản đồ
              </button>
              <button className={styles.confirmButton} onClick={confirmModalAddress} disabled={isLoading}>
                Xác nhận địa chỉ
              </button>
              {routeInfo && (
                <div className={styles.routeInfo}>
                  <p>Khoảng cách: {(routeInfo.distance / 1000).toFixed(2)} km</p>
                  <p>Thời gian ước tính: {(routeInfo.duration / 60).toFixed(0)} phút</p>
                  <p>Phí giao hàng: {Math.ceil((routeInfo.distance / 1000) * SHIPPING_RATE / 1000) * 1000} đ (5.000đ/km)</p>
                </div>
              )}
              {showMapInModal && (
                <div className={styles.mapWrapper}>
                  <AddressMap address={modalAddress} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;