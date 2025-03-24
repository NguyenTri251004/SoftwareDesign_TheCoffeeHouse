import styles from "./Checkout.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import { FaFile } from "react-icons/fa";

const Checkout = () => {
  return (
    <div className={styles.checkoutContainer}>
      <Header />
      <div className={styles.checkoutContent}>
        <h2 className={styles.title}><FaFile color="orange" /> Xác nhận đơn hàng</h2>
        <div className={styles.orderContainer}>
          <div className={styles.shippingSection}>
            <div className={styles.sectionHeader}>
              <h3>Giao hàng</h3>
              <button className={styles.editButton}>🖌️ Chỉnh sửa</button>
            </div>
            <div className={styles.addressBox}>
              <p>
                <strong>227 Nguyễn Văn Cừ</strong>
              </p>
              <p>227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM</p>
              <p>Chi Minh 800000, VIỆT NAM</p>
            </div>
            <input
              type="text"
              placeholder="Số điện thoại"
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="Thêm hướng dẫn giao hàng"
              className={styles.inputField}
            />

            {/* Payment Methods Section */}
            <h3 className={styles.sectionHeader}>Phương thức thanh toán</h3>
            <div className={styles.paymentMethods}>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" defaultChecked />
                <span className={styles.paymentIcon}>💵</span> Tiền mặt
              </label>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <span className={styles.paymentIcon}>
                  <img src="/path-to-vnpay-icon.png" alt="VNPAY" />
                </span>{" "}
                VNPAY
              </label>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <span className={styles.paymentIcon}>
                  <img src="/path-to-momo-icon.png" alt="MoMo" />
                </span>{" "}
                MoMo
              </label>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <span className={styles.paymentIcon}>
                  <img src="/path-to-zalopay-icon.png" alt="ZaloPay" />
                </span>{" "}
                ZaloPay
              </label>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <span className={styles.paymentIcon}>
                  <img src="/path-to-shopeepay-icon.png" alt="ShopeePay" />
                </span>{" "}
                ShopeePay
              </label>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <span className={styles.paymentIcon}>💳</span> Thẻ ngân hàng
              </label>
            </div>
            <div className={styles.terms}>
              <input type="checkbox" />
              <span>
                Đồng ý với{" "}
                <a href="#" className={styles.termsLink}>
                  điều khoản và điều kiện mua hàng
                </a>{" "}
                của The Coffee House
              </span>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className={styles.orderSummary}>
            <h3 className={styles.sectionHeader}>Các món đã chọn</h3>
            <button className={styles.addMoreButton}>Thêm món</button>
            <div className={styles.orderItem}>
              <p>1 x Ánh Đào</p>
              <p>Lớn</p>
              <p className={styles.price}>55.000đ</p>
            </div>
            <div className={styles.orderItem}>
              <p>1 x Matcha Latte</p>
              <p>Lớn</p>
              <p className={styles.price}>55.000đ</p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.summaryRow}>
              <p>Tổng cộng</p>
              <p className={styles.price}>110.000đ</p>
            </div>
            <div className={styles.summaryRow}>
              <p>Phí giao hàng</p>
              <p className={styles.price}>18.000đ</p>
            </div>
            <div className={styles.summaryRow}>
              <p>Khuyến mãi</p>
              <p className={styles.price}>-18.000đ</p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.summaryRow}>
              <h3>Thành tiền</h3>
              <h3 className={styles.price}>110.000đ</h3>
            </div>
            <button className={styles.confirmButton}>Đặt hàng</button>
            <button className={styles.cancelButton}>Hủy đơn hàng</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;