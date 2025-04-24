import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import styles from './CartPage.module.css';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import CartAPI from 'services/cartService';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const isCustomer = localStorage.getItem('role') === 'customer';

        if (isCustomer && user?.id) {
          const cartData = await CartAPI.getCartByUserId(user.id);
          const formattedCart = cartData.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            topping: item.toppings,
          }));
          setProducts(formattedCart);
          setSelectedItems(formattedCart.map((item) => item.productId));
        } else {
          const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
          setProducts(savedCart);
          setSelectedItems(savedCart.map((item) => item.productId));
        }
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        setError(error.message || 'Không thể tải giỏ hàng');
        if (
          error.message.includes('No token found') ||
          error.message.includes('Invalid or expired token')
        ) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          dispatch(clearUser());
          const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
          setProducts(savedCart);
          setSelectedItems(savedCart.map((item) => item.productId));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [user, dispatch]);

  const toggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const updateQuantity = async (index, delta) => {
    const isCustomer = localStorage.getItem('role') === 'customer';
    const newProducts = [...products];
    const product = newProducts[index];
    const basePrice = product.totalPrice / product.quantity;
    product.quantity += delta;

    if (product.quantity <= 0) {
      newProducts.splice(index, 1);
    } else {
      product.totalPrice = basePrice * product.quantity;
    }

    setProducts(newProducts);
    setSelectedItems(newProducts.map((p) => p.productId));

    if (isCustomer && user?.id) {
      try {
        if (product.quantity <= 0) {
          await CartAPI.removeFromCart(user.id, index);
        } else {
          await CartAPI.addToCart({
            userId: user.id,
            item: {
              productId: product.productId,
              name: product.name,
              size: product.size,
              quantity: product.quantity,
              unitPrice: basePrice,
              totalPrice: product.totalPrice,
              toppings: product.topping,
            },
          });
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
        setError('Không thể cập nhật giỏ hàng: ' + error.message);
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(newProducts));
    }
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

  const handleDeleteOrder = async () => {
    const isCustomer = localStorage.getItem('role') === 'customer';
    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng không?')) {
      return;
    }

    if (isCustomer && user?.id) {
      try {
        await CartAPI.removeFromCart(user.id, -1);
      } catch (error) {
        console.error('Lỗi khi xóa giỏ hàng:', error);
        setError('Không thể xóa giỏ hàng: ' + error.message);
        return;
      }
    }

    localStorage.removeItem('cart');
    setProducts([]);
    setSelectedItems([]);
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const totalAmount = products.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.cartWrapper}>
        <h2 className={styles.heading}>🛒 Giỏ hàng của bạn</h2>
        {isLoading && <p className={styles.loading}>Đang tải giỏ hàng...</p>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {products.length === 0 && !isLoading ? (
          <div className={styles.emptyCart}>
            <p className={styles.empty}>Giỏ hàng hiện đang trống.</p>
            <button className={styles.orderBtn} onClick={handleBackToMenu}>
              Quay lại menu
            </button>
          </div>
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
                      ? item.topping.map((t, i) => (
                          <li key={i}>{t.name} (x{t.quantity})</li>
                        ))
                      : <li>Không có topping</li>}
                  </ul>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(index, -1)} disabled={isLoading}>
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, 1)} disabled={isLoading}>
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
            <button
              className={styles.orderBtn}
              onClick={handleProceedToCheckout}
              disabled={isLoading}
            >
              ✅ Tiến hành đặt hàng
            </button>
            <button
              className={styles.clearBtn}
              onClick={handleDeleteOrder}
              disabled={isLoading}
            >
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