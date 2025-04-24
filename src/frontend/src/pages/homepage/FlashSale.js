import React, { useEffect, useState } from "react";
import styles from "./FlashSale.module.css";
import { useNavigate } from "react-router-dom";
import FlashSaleAPI from "services/flashsaleService";
import flashSaleBanner from "assets/images/flashsale_banner.jpg"; // Import ảnh banner

const FlashSale = () => {
  const navigate = useNavigate();
  const [flashSales, setFlashSales] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const shopId = localStorage.getItem("currentShopId"); // Lấy shopId từ localStorage
        const res = await FlashSaleAPI.getFlashSalesByShop(shopId);

        if (res.data.current) {
          setFlashSales(res.data.current.products);
          calculateTimeLeft(res.data.current.endTime);
        }
      } catch (error) {
        console.error("Lỗi khi lấy Flash Sale:", error.message);
      }
    };

    fetchFlashSales();
  }, []);

  const calculateTimeLeft = (endTime) => {
    const interval = setInterval(() => {
      const end = new Date(endTime);
      const now = new Date();
      const diff = Math.max(0, end - now);
      const h = Math.floor(diff / 1000 / 60 / 60);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
          .toString()
          .padStart(2, "0")}`
      );

      if (diff <= 0) clearInterval(interval);
    }, 1000);
  };

  return (
    <div
      className={styles.flashSaleContainer}
      onClick={() => navigate("/flashsale")}
    >
      <div className={styles.header}>
        <h2 onClick={() => navigate("/flashsale")}>🔥 Flash Sale</h2>
        <span className={styles.timer}>{timeLeft}</span>
      </div>
      <div className={styles.productList}>
        {flashSales.length === 0 ? (
          // Hiển thị ảnh banner khi đang tải
          <div className={styles.bannerContainer}>
            <img
              src={flashSaleBanner}
              alt="Flash Sale Banner"
              className={styles.bannerImage}
            />
          </div>
        ) : (
          // Hiển thị danh sách sản phẩm khi đã tải xong
          flashSales.map((item) => {
            const product = item.productId;
            const salePrice = Math.floor(
              (product.price * (100 - item.discountPercentage)) / 100
            );

            return (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={product.image || "/default-image.jpg"}
                    alt={product.name}
                  />
                  {item.bestSeller && (
                    <span className={styles.bestSeller}>Best Seller</span>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p className={styles.oldPrice}>
                  {product.price.toLocaleString()} đ
                </p>
                <p className={styles.newPrice}>
                  {salePrice.toLocaleString()} đ
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FlashSale;
