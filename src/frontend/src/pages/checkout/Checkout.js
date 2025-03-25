import styles from "./Checkout.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import { FaFile, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";


const Checkout = () => {
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
              <button className={styles.editButton}>Đổi phương thức</button>
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
                    <strong>227 Nguyễn Văn Cừ</strong>
                  </p>
                  <p>
                    227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh
                    Chi Minh 800000, Việt Nam
                  </p>
                </div>
                <span className={styles.arrowIcon}>
                  <IoIosArrowForward />
                </span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Tên người nhận"
              className={styles.inputField}
            />
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

            <h3 className={styles.sectionHeader}>Phương thức thanh toán</h3>
            <div className={styles.paymentMethods}>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" defaultChecked />
                <BsCash className={styles.paymentIcon} />
                <span> Tiền mặt </span>
              </label>
              <hr className={styles.divider} />
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <img
                  className={styles.paymentIcon}
                  src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
                  alt="VNPay"
                />
                <span>VNPAY </span>
              </label>
              <hr className={styles.divider} />
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <img
                  className={styles.paymentIcon}
                  src="https://homepage.momocdn.net/fileuploads/svg/momo-file-240411162904.svg"
                  alt="Momo"
                />
                <span>Momo </span>
              </label>

              <hr className={styles.divider} />
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <img
                  className={styles.paymentIcon}
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgumCewiq6XqWwa4PkX7fLDKGEWOOVdksz180lH7NNEI4Mw5ArNn1aLKbLyEKy3UOuDupIhTvyNGiSyKEdmL7iPq3Ja667bo2umKl_LnnGQMdkuUl602_rLA4MgtwThR5pSDEKHRf44TFRHY_g6-nYHxs4pss-aB8JZdLMuTvlvW14-16Co-uCw8tRu/s72-c/ZaloPay.jpg"
                  alt="Zalopay"
                />
                <span>Zalopay </span>
              </label>
              <hr className={styles.divider} />

              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <img
                  className={styles.paymentIcon}
                  src="https://shopeepay.vn/static/media/shopeePayLogo2022.67d2e522e841720cf971c77142ace5e4.svg"
                  alt="ShopeePay"
                />
                <span>ShopeePay </span>
              </label>
              <hr className={styles.divider} />
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <FaRegCreditCard
                  className={styles.paymentIcon}
                  src="https://shopeepay.vn/static/media/shopeePayLogo2022.67d2e522e841720cf971c77142ace5e4.svg"
                  alt="CreditCard"
                />
                <span>Thẻ ngân hàng </span>
              </label>
              <hr className={styles.divider} />
            </div>
            <div className={styles.terms}>
              <input type="checkbox"/>
              <span>
                Đồng ý với điều khoản và điều kiện mua hàng của The Coffee House
              </span>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.orderSummaryDetail}>
              <div className={styles.headerRow}>
                <h3 className={styles.sectionHeader}>Các món đã chọn</h3>
                <button className={styles.addMoreButton}>Thêm món</button>
              </div>
              <div className={styles.orderItem}>
                <div className={styles.orderItemContent}>
                  <MdEdit className={styles.editIcon} />
                  <div className={styles.orderItemContentDetail}>
                    <p className={styles.drinkName}>
                      <strong>1 x A-mê Đào</strong>
                    </p>
                    <p>Lớn</p>
                    <p>Xóa</p>
                  </div>
                </div>
                <p className={styles.price}>55.000đ</p>
              </div>
              <div className={styles.orderItem}>
                <div className={styles.orderItemContent}>
                  <MdEdit className={styles.editIcon} />
                  <div className={styles.orderItemContentDetail}>
                    <p className={styles.drinkName}>
                      <strong>1 x Matcha Latte</strong>
                    </p>
                    <p>Lớn</p>
                    <p>Xóa</p>
                  </div>
                </div>
                <p className={styles.price}>55.000đ</p>
              </div>
              <h3 className={styles.sectionHeader}> Tổng cộng</h3>
              <div className={styles.summaryRow}>
                <p>Thành tiền</p>
                <p className={styles.price}>110.000đ</p>
              </div>
              <hr className={styles.divider} />
              <div className={styles.summaryRow}>
                <p>Phí giao hàng</p>
                <p className={styles.price}>18.000đ</p>
              </div>
              <div className={styles.summaryRow}>
                <p>Bạn có mã Freeship trong mục ưu đãi</p>
                <p className={`${styles.price} ${styles.strikeThrough}`}>0đ</p>
              </div>
              <hr className={styles.divider} />
              <div className={styles.summaryDiscountRow}>
                <div className={styles.discountContainer}>
                  <p className={styles.discountLabel}>Khuyến mãi</p>
                  <div className={styles.discountRow}>
                    <p className={styles.discountDetail}>Miễn phí vận chuyển</p>
                    <p className={styles.price}>-18.000đ</p>
                  </div>
                  <p className={styles.removeDiscount}>Xóa</p>
                </div>
              </div>
            </div>

            <div className={styles.totalSection}>
              <div className={styles.totalDetails}>
                <h3 className={styles.sectionTotal}>Thành tiền</h3>
                <p className={styles.sectionPrice}>110.000đ</p>
              </div>
              <button className={styles.confirmButton}>Đặt hàng</button>
            </div>

            <button className={styles.cancelButton}>
              <FaTrashAlt role="img" aria-label="trash"/>
              <span> Xóa đơn hàng </span>
        </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
