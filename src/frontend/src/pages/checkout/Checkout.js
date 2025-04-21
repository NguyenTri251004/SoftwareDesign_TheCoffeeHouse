import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Checkout.module.css';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { FaFile, FaTrashAlt } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { SiGooglemaps } from 'react-icons/si';
import AddressMap from '../../components/map/AddressMap';
import OrderAPI from 'services/orderService';

const PaymentMethods = [
  { id: 'cash', label: 'Tiền mặt' },
  { id: 'vnpay', label: 'VNPAY' },
  { id: 'momo', label: 'MoMo' },
  { id: 'zalopay', label: 'ZaloPay' },
  { id: 'shopeepay', label: 'ShopeePay' },
  { id: 'card', label: 'Thẻ ngân hàng' },
];

const Checkout = () => {
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
  const navigate = useNavigate();

  const storeCoordinates = { lat: 10.762622, lon: 106.660172 };
  const shippingFee = products.length > 0 ? 15000 : 0;
  const discount = 0;

  // Load cart, userAddress, and deliveryAddress from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedUserAddress = localStorage.getItem('userAddress') || '';
    setProducts(savedCart);
    setDeliveryAddress(savedUserAddress); // Use userAddress for deliveryAddress
    setModalAddress(savedUserAddress);
  }, []);

  // Calculate total and final amounts
  const totalAmount = products.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalAmount = totalAmount + shippingFee - discount;

  // Modal address handling
  const showModalAddress = () => {
    setModalAddress(deliveryAddress);
    setShowModal(true);
  };

  const closeModalAddress = () => {
    setShowModal(false);
    setShowMapInModal(false);
    setRouteInfo(null);
  };

  // Confirm address from modal and save to localStorage as userAddress and deliveryAddress
  const confirmModalAddress = () => {
    setDeliveryAddress(modalAddress);
    localStorage.setItem('userAddress', modalAddress);
    localStorage.setItem('deliveryAddress', modalAddress);
    closeModalAddress();
  };

  // Calculate route using OSRM
  const handleUseMap = async () => {
    if (!modalAddress) {
      alert('Vui lòng nhập địa chỉ!');
      return;
    }
    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(modalAddress)}`,
        { headers: { 'User-Agent': 'MyApp/1.0 (myemail@example.com)' } }
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

  // Place order
  const handlePlaceOrder = async () => {
    if (!recipientName || !deliveryAddress || !phone) {
      alert('Vui lòng điền đầy đủ thông tin người nhận!');
      return;
    }

    const shopId = localStorage.getItem('currentShopId') || '67e832a5d0be3d6ab71556a0';

    const orderPayload = {
      useName: recipientName,
      shopId,
      deliveryAddress,
      phone,
      status: 'Pending',
      refundStatus: 'None',
      products: products.map((p) => ({
        productId: p.productId,
        size: p.size,
        amount: p.amount,
        unitPrice: p.unitPrice,
        totalPrice: p.totalPrice,
        topping: p.topping?.map((t) => ({ toppingId: t.toppingId })) || [],
      })),
      totalAmount,
      shippingFee,
      discount,
      finalAmount,
      note,
      paymentMethod,
    };

    try {
      const res = await OrderAPI.postOrder(orderPayload);
      if (res && res.success !== false) {
        alert('Đặt hàng thành công!');
        localStorage.removeItem('cart');
        setProducts([]);
        setRecipientName('');
        setPhone('');
        setNote('');
        navigate('/');
      } else {
        alert('Đặt hàng thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Đặt hàng thất bại. Vui lòng thử lại!');
    }
  };

  // Delete cart with confirmation and redirect to homepage
  const handleDeleteOrder = () => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa đơn hàng này không?');
    if (confirmDelete) {
      localStorage.removeItem('cart');
      localStorage.removeItem('userAddress');
      localStorage.removeItem('deliveryAddress');
      setProducts([]);
      setDeliveryAddress('');
      navigate('/');
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <Header />
      <div className={styles.checkoutContent}>
        <h2 className={styles.title}>
          <FaFile color="orange" /> Xác nhận đơn hàng
        </h2>
        <div className={styles.orderContainer}>
          <div className={styles.shippingSection}>
            <div className={styles.sectionHeader}>
              <h3>Giao hàng</h3>
              <button className={styles.editButton} onClick={showModalAddress}>
                Đổi địa chỉ
              </button>
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
            <input
              type="text"
              placeholder="Tên người nhận"
              className={styles.inputField}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className={styles.inputField}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Thêm ghi chú (nếu có)"
              className={styles.inputField}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <h3 className={styles.sectionHeader}>Phương thức thanh toán</h3>
            <div className={styles.paymentMethods}>
              {PaymentMethods.map((method) => (
                <div key={method.id}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <img
                      className={styles.paymentIcon}
                      src={
                        method.id === 'cash'
                          ? 'https://minio.thecoffeehouse.com/image/tchmobileapp/1000_photo_2021-04-06_11-17-08.jpg'
                          : method.id === 'vnpay'
                          ? 'https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg'
                          : method.id === 'momo'
                          ? 'https://homepage.momocdn.net/fileUploads/svg/momo-file-240411162904.svg'
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
              <input type="checkbox" defaultChecked />
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
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.orderItemContent}>
                      <MdEdit className={styles.editIcon} />
                      <div className={styles.orderItemContentDetail}>
                        <p className={styles.drinkName}>
                          <strong>
                            {item.amount} x {item.name || 'Sản phẩm'} ({item.size})
                          </strong>
                        </p>
                        <ul>
                          {item.topping && item.topping.length > 0 ? (
                            item.topping.map((t, i) => <li key={i}>{t.name}</li>)
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
                <p>Phí giao hàng</p>
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
              <button className={styles.confirmButton} onClick={handlePlaceOrder}>
                Đặt hàng
              </button>
            </div>

            <button className={styles.cancelButton} onClick={handleDeleteOrder}>
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
              <input
                type="text"
                className={styles.inputField}
                placeholder="Vui lòng nhập địa chỉ"
                value={modalAddress}
                onChange={(e) => setModalAddress(e.target.value)}
              />
              <button className={styles.locationButton} onClick={handleUseMap}>
                <span className={styles.locationIcon}>
                  <SiGooglemaps />
                </span>
                Dùng định vị bản đồ
              </button>
              <button className={styles.confirmButton} onClick={confirmModalAddress}>
                Xác nhận địa chỉ
              </button>
              {routeInfo && (
                <div className={styles.routeInfo}>
                  <p>Khoảng cách: {(routeInfo.distance / 1000).toFixed(2)} km</p>
                  <p>Thời gian ước tính: {(routeInfo.duration / 60).toFixed(0)} phút</p>
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