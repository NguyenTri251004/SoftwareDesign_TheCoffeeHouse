import React, { useEffect, useState } from 'react';
import styles from './CartPage.module.css';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import OrderAPI from 'services/orderService';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setProducts(savedCart);
    setSelectedItems(savedCart.map((item) => item.productId));
  }, []);

  const toggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const updateQuantity = (index, delta) => {
    const newProducts = [...products];
    const basePrice = newProducts[index].totalPrice / newProducts[index].quantity;
    newProducts[index].quantity += delta;

    if (newProducts[index].quantity <= 0) {
      newProducts.splice(index, 1);
    } else {
      newProducts[index].totalPrice =
        basePrice * newProducts[index].quantity;
    }

    setProducts(newProducts);
    localStorage.setItem('cart', JSON.stringify(newProducts));
    setSelectedItems(newProducts.map((p) => p.productId));
  };

  const handleProceedToCheckout = () => {
    const selected = products.filter((p) => selectedItems.includes(p.productId));
    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một món để đặt hàng!');
      return;
    }

    localStorage.setItem('selectedCart', JSON.stringify(selected));
    navigate('/checkout');
  };

  const handleDeleteOrder = () => {
    localStorage.removeItem('cart');
    setProducts([]);
    setSelectedItems([]);
  };

  const totalAmount = products.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.cartWrapper}>
        <h2 className={styles.heading}>🛒 Giỏ hàng của bạn</h2>

        {products.length === 0 ? (
          <p className={styles.empty}>Giỏ hàng hiện đang trống.</p>
        ) : (
          <div className={styles.productList}>
            {products.map((item, index) => (
              <div key={index} className={styles.productItem}>
                <div className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productId)}
                    onChange={() => toggleSelect(item.productId)}
                  />
                </div>

                <div className={styles.info}>
                  <p className={styles.name}>
                    {item.name} ({item.size})
                  </p>
                  <ul className={styles.toppings}>
                    {item.topping?.length > 0
                      ? item.topping.map((t, i) => <li key={i}>{t.name}</li>)
                      : <li>Không có topping</li>}
                  </ul>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(index, -1)}>
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, 1)}>
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className={styles.price}>
                  {item.totalPrice.toLocaleString()}đ
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className={styles.summarySection}>
            <div className={styles.totalRow}>
              <span>Tạm tính:</span>
              <strong>{totalAmount.toLocaleString()}đ</strong>
            </div>
            <button className={styles.orderBtn} onClick={handleProceedToCheckout}>
              ✅ Tiến hành đặt hàng
            </button>
            <button className={styles.clearBtn} onClick={handleDeleteOrder}>
              🗑 Xóa toàn bộ giỏ hàng
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
