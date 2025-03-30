import React, { useState, useEffect } from "react";
import styles from "./Menu.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

import { menuItems } from "./menuData";

const Menu = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [activeItem, setActiveItem] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(
    menuItems[0].products
  );

  const location = useLocation();
  const navigate = useNavigate(); // Sử dụng useNavigate

  // Hàm lọc sản phẩm dựa theo activeItem
  const filterProducts = (activeItem) => {
    if (activeItem === null) {
      return [];
    }
    if (typeof activeItem === "number") {
      const activeMenuItem = menuItems[activeItem];
      if (activeMenuItem.products && activeMenuItem.products.length > 0) {
        return activeMenuItem.products;
      }
    }
    if (typeof activeItem === "string") {
      const [parentIndex, subIndex] = activeItem.split("-").map(Number);
      const parentItem = menuItems[parentIndex];

      if (
        parentItem &&
        parentItem.subMenu &&
        parentItem.subMenu[subIndex] &&
        parentItem.subMenu[subIndex].products
      ) {
        return parentItem.subMenu[subIndex].products;
      }
    }
    return [];
  };

  useEffect(() => {
    // Tìm menu item hoặc sub menu item khớp với location.pathname
    const findActiveItem = (items, parentIndex = null) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.path === location.pathname) {
          setActiveItem(parentIndex !== null ? `${parentIndex}-${i}` : i);
          // Mở menu cha nếu URL khớp với menu cha
          if (parentIndex === null && item.subMenu) {
            setOpenMenuIndex(i);
          }
          return;
        }
        if (item.subMenu) {
          const subIndex = item.subMenu.findIndex(
            (subItem) => subItem.path === location.pathname
          );
          if (subIndex > -1) {
            setActiveItem(`${i}-${subIndex}`);
            setOpenMenuIndex(i);
            return;
          }
        }
      }
    };
    findActiveItem(menuItems);
  }, [location, menuItems]);

  useEffect(() => {
    let newFilteredProducts;

    if (activeItem === 0) {
      // Nếu "Tất cả" được chọn, hiển thị tất cả sản phẩm
      newFilteredProducts = menuItems.flatMap((item) =>
        item.subMenu
          ? item.subMenu.flatMap((subItem) => subItem.products || [])
          : item.products || []
      );
    } else {
      // Lọc sản phẩm dựa trên activeItem
      newFilteredProducts = filterProducts(activeItem);
    }

    setFilteredProducts(newFilteredProducts);
  }, [activeItem, menuItems]);

  const handleMenuItemClick = (index, path) => {
    // Thêm tham số path
    setOpenMenuIndex(openMenuIndex === index ? null : index);
    setActiveItem(index);
    navigate(path); // Sử dụng navigate để thay đổi URL
  };

  const handleSubMenuItemClick = (parentIndex, subIndex, path) => {
    // Thêm tham số path
    setActiveItem(`${parentIndex}-${subIndex}`);
    navigate(path); // Sử dụng navigate để thay đổi URL
  };

  return (
    <div className={styles.menuContainer}>
      <Header />
      <div className={styles.menuWrapper}>
        <div className={styles.menuSidebar}>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#" // Loại bỏ href để không gây ra chuyển hướng mặc định
                  onClick={(e) => {
                    e.preventDefault(); // Ngăn chặn hành vi mặc định của <a>
                    if (item.subMenu) {
                      handleMenuItemClick(index, item.path); // Truyền path
                    } else {
                      handleMenuItemClick(index, item.path); // Truyền path
                    }
                  }}
                  className={activeItem === index ? styles.active : ""}
                >
                  {item.label}
                </a>

                {item.subMenu && openMenuIndex === index && (
                  <ul>
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href="#" // Loại bỏ href
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định của <a>
                            handleSubMenuItemClick(
                              index,
                              subIndex,
                              subItem.path
                            ); // Truyền path
                          }}
                          className={
                            activeItem === `${index}-${subIndex}`
                              ? styles.active
                              : ""
                          }
                        >
                          • {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.menuContent}>
          {activeItem === 0 ? ( // Trường hợp "Tất cả"
            menuItems.map((menuItem) =>
              menuItem.subMenu?.map((subItem) => (
                <div key={subItem.label}>
                  <h2 className={styles.subMenuTitle}>{subItem.label}</h2>
                  <div className={styles.productList}>
                    {subItem.products?.map((product) => (
                      <div key={product.id} className={styles.productItem}>
                        <div className={styles.imageContainer}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className={styles.productImage}
                          />
                        </div>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productPrice}>
                          {product.price.toLocaleString()} đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )
          ) : typeof activeItem === "string" ? ( // Trường hợp chọn submenu cụ thể
            <>
              <h2 className={styles.subMenuTitle}>
                {
                  menuItems[activeItem.split("-")[0]].subMenu[
                    activeItem.split("-")[1]
                  ].label
                }
              </h2>
              <div className={styles.productList}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.imageContainer}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                      />
                    </div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>
                      {product.price.toLocaleString()} đ
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : // Trường hợp chọn menu chính (không phải "Tất cả")
          menuItems[activeItem]?.subMenu ? (
            menuItems[activeItem].subMenu.map((subItem) => (
              <div key={subItem.label}>
                <h2 className={styles.subMenuTitle}>{subItem.label}</h2>
                <div className={styles.productList}>
                  {subItem.products?.map((product) => (
                    <div key={product.id} className={styles.productItem}>
                      <div className={styles.imageContainer}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      </div>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>
                        {product.price.toLocaleString()} đ
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Menu;
