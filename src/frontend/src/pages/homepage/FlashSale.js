import React, { useEffect, useState } from "react";
import styles from "./FlashSale.module.css";
import { useNavigate } from "react-router-dom";
import FlashSaleAPI from "services/flashsaleService";

const FlashSale = () => {
  const navigate = useNavigate();
  const [flashSale, setFlashSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const shopId = localStorage.getItem("currentShopId");
        const res = await FlashSaleAPI.getFlashSalesByShop(shopId);
        if (res.data?.current) {
          setFlashSale(res.data.current);
        }
      } catch (err) {
        console.error("Lỗi khi tải Flash Sale:", err);
      }
    };

    fetchFlashSale();
  }, []);

  useEffect(() => {
    if (!flashSale?.endTime) return;

    const interval = setInterval(() => {
      const end = new Date(flashSale.endTime);
      const now = new Date();
      const diff = Math.max(0, end - now);
      const h = Math.floor(diff / 1000 / 60 / 60);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale]);

  if (!flashSale) return null;

  const products = flashSale.products.slice(0, 3);

  return (
    <div className={styles.flashSaleContainer}>
      <div className={styles.header}>
        <h2 onClick={() => navigate("/flashsale")} style={{ cursor: "pointer" }}>🔥 Flash Sale</h2>
        <span className={styles.timer}>{timeLeft}</span>
      </div>

      <div className={styles.productList}>
        {products.map((item) => {
          const product = item.productId;
          const salePrice = Math.floor(product.price * (100 - item.discountPercentage) / 100);

          return (
            <div
              key={product._id}
              className={styles.productCard}
              onClick={() =>
                navigate(`/drink/detail/${product._id}?flashSaleId=${flashSale._id}&salePrice=${salePrice}`)
              }
            >
              <div className={styles.imageContainer}>
                <img src={product.image} alt={product.name} />
                {item.bestSeller && (
                  <span className={styles.bestSeller}>Best Seller</span>
                )}
              </div>
              <h3>{product.name}</h3>
              <p className={styles.oldPrice}>{product.price.toLocaleString()} đ</p>
              <p className={styles.newPrice}>{salePrice.toLocaleString()} đ</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlashSale;
