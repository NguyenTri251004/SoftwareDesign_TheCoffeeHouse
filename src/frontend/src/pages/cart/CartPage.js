import React, { useEffect, useState } from 'react';
import styles from './CartPage.module.css';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import OrderAPI from 'services/orderService';

const PaymentMethods = [
  { id: 'cash', label: 'Tiền mặt' },
  { id: 'vnpay', label: 'VNPAY' },
  { id: 'momo', label: 'MoMo' },
  { id: 'zalopay', label: 'ZaloPay' },
  { id: 'shopeepay', label: 'ShopeePay' },
  { id: 'card', label: 'Thẻ ngân hàng' },
];

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const shippingFee = products.length > 0 ? 15000 : 0;
  const discount = 0;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setProducts(savedCart);
  }, []);

  const totalAmount = products.reduce((sum, item) => sum + item.totalPrice, 0);
  const finalAmount = totalAmount + shippingFee - discount;

  const handlePlaceOrder = async () => {
    if (!recipientName || !deliveryAddress || !phone) {
      alert('Vui lòng điền đầy đủ thông tin người nhận!');
      return;
    }
    
    const shopId = localStorage.getItem("currentShopId") || "67e832a5d0be3d6ab71556a0";

    const orderPayload = {
      useName: recipientName, // Lưu ý: Có thể đây là lỗi đánh máy, nên là `userName`?
      shopId: shopId,
      deliveryAddress,
      phone,
      status: 'Pending',
      refundStatus: 'None',
      products: products.map((p) => ({
        productId: p.productId,
        size: p.size,
        amount: p.quantity, // Sửa từ amount thành quantity
        unitPrice: p.unitPrice,
        totalPrice: p.totalPrice,
        topping: p.topping?.map((t) => ({ toppingId: t.toppingId })) || [],
      })),
      totalAmount,
      shippingFee,
      discount,
      finalAmount,
    };
  
    const res = await OrderAPI.postOrder(orderPayload);
    if (res && res.success !== false) {
      alert('Đặt hàng thành công!');
      localStorage.removeItem('cart');
      setProducts([]);
    } else {
      alert('Đặt hàng thất bại. Vui lòng thử lại!');
    }
  };
  

  const handleDeleteOrder = () => {
    localStorage.removeItem('cart');
    setProducts([]);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.cartContainer}>
        <h2 className={styles.heading}>📁 Xác nhận đơn hàng</h2>

        <div className={styles.wrapper}>
          <div className={styles.left}>
            <div className={styles.section}>
              <h3>Giao hàng</h3>
              <input
                type="text"
                placeholder="Tên người nhận"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Địa chỉ giao hàng"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ghi chú thêm (nếu có)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <p>Nhận hàng trong ngày 15-30 phút</p>
            </div>

            <div className={styles.section}>
              <h3>Phương thức thanh toán</h3>
              {PaymentMethods.map((method) => (
                <label key={method.id} className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  {method.label}
                </label>
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

          <div className={styles.right}>
            <h3>Các món đã chọn</h3>
            {products.length === 0 ? (
              <p className={styles.emptyMessage}>Chưa có sản phẩm nào trong đơn hàng.</p>
            ) : (
              products.map((item, index) => (
                <div key={index} className={styles.item}>
                  <p>
                    {item.quantity} x {item.name || 'Sản phẩm'} ({item.size}) {/* Sửa từ item.amount thành item.quantity */}
                  </p>
                  <ul>
                    {item.topping && item.topping.length > 0 ? (
                      item.topping.map((t, i) => <li key={i}>{t.name}</li>)
                    ) : (
                      <li>Không có topping</li>
                    )}
                  </ul>
                  <p className={styles.price}>{item.totalPrice.toLocaleString()}đ</p>
                </div>
              ))
            )}

            <div className={styles.summary}>
              <p>Thành tiền: <strong>{totalAmount.toLocaleString()}đ</strong></p>
              <p>Phí giao hàng: <strong>{shippingFee.toLocaleString()}đ</strong></p>
              <p>Khuyến mãi: <strong>-{discount.toLocaleString()}đ</strong></p>
              <p className={styles.total}>Tổng cộng: <strong>{finalAmount.toLocaleString()}đ</strong></p>
            </div>

            <button className={styles.orderButton} onClick={handlePlaceOrder}>
              Đặt hàng
            </button>

            <button className={styles.cancelButton} onClick={handleDeleteOrder}>
              🗑 Xóa giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;