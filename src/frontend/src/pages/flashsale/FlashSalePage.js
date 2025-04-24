import React, { useEffect, useState } from "react";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import styles from "./FlashSaleDetail.module.css";
import FlashSaleAPI from "services/flashsaleService";

const FlashSalePage = () => {
  const [flashSale, setFlashSale] = useState(null);
  const [allFlashSales, setAllFlashSales] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const shopId = localStorage.getItem("currentShopId");
        const res = await FlashSaleAPI.getFlashSalesByShop(shopId);

        const combinedFlashSales = [
          ...(res.data.current ? [res.data.current] : []),
          ...(res.data.upcoming || [])
        ];

        setAllFlashSales(combinedFlashSales);
        setFlashSale(combinedFlashSales[0]);
      } catch (err) {
        console.error("Lỗi khi lấy Flash Sale:", err);
      }
    };

    fetchFlashSales();
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

  const handleSelectTime = (index) => {
    setSelectedIndex(index);
    setFlashSale(allFlashSales[index]);
  };

  const isUpcoming = flashSale?.status === "Upcoming";

  return (
    <div className={styles.flashSaleContainer}>
      <Header />

      <div className={styles.flashSaleHeader}>
        <div className={styles.flashSaleTitle}>
          <span className={styles.flashText}>Flash Sale</span>
          <span className={styles.countdown}>kết thúc trong {timeLeft}</span>
        </div>

        <div className={styles.timeNav}>
          {allFlashSales.map((fs, index) => (
            <div
              key={fs._id}
              className={`${styles.timeBox} ${selectedIndex === index ? styles.active : ""}`}
              onClick={() => handleSelectTime(index)}
            >
              <div className={styles.time}>
                {new Date(fs.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}- 
                {new Date(fs.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={styles.label}>
                {fs.status === "Active" ? "Đang diễn ra" : fs.status === "Upcoming" ? "Sắp diễn ra" : "Đã kết thúc"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.productList}>
        {flashSale?.products?.map((item) => {
          const product = item.productId;
          const salePrice = Math.floor(product.price * (100 - item.discountPercentage) / 100);

          return (
            <div key={product._id} className={styles.productItem}
            onClick={() => {
              if (flashSale.status === "Active") {
                window.location.href = `/drink/detail/${product._id}?flashSaleId=${flashSale._id}&salePrice=${salePrice}`;
              } else {
                window.location.href = `/drink/detail/${product._id}`;
              }
            }}
            
            
              style={{ cursor: "pointer" }}
            >

              <div className={styles.imageContainer}>
                <img src={product.image} alt={product.name} />
              </div>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.priceSection}>
                <span className={styles.originalPrice}>{product.price.toLocaleString()} đ</span>
                <span className={styles.salePrice}>
                  {isUpcoming ? "?.000 đ" : `${salePrice.toLocaleString()} đ`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default FlashSalePage;
