import React from "react";
import styles from "./FlashSale.module.css";
import product1 from "assets/images/flashsale-1.png";
import product2 from "assets/images/flashsale-2.png";
import product3 from "assets/images/flashsale-3.png";

const FlashSale = () => {
  const products = [
    {
      id: 1,
      image: product1,
      name: "Hi-Tea Vải",
      oldPrice: "49.000 đ",
      newPrice: "39.000 đ",
      bestSeller: true,
    },
    {
      id: 2,
      image: product2,
      name: "Cơm chiên hải sản",
      oldPrice: "69.000 đ",
      newPrice: "49.000 đ",
      bestSeller: false,
    },
    {
      id: 3,
      image: product3,
      name: "Mochi Kem",
      oldPrice: "19.000 đ",
      newPrice: "9.000 đ",
      bestSeller: false,
    },
  ];

  return (
    <div className={styles.flashSaleContainer}>
      <div className={styles.header}>
        <h2>🔥 Flash Sale</h2>
        <span className={styles.timer}>00:12:34</span>
      </div>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <img src={product.image} alt={product.name} />
              {product.bestSeller && (
                <span className={styles.bestSeller}>Best Seller</span>
              )}
            </div>
            <h3>{product.name}</h3>
            <p className={styles.oldPrice}>{product.oldPrice}</p>
            <p className={styles.newPrice}>{product.newPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
