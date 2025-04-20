import React, { useState, useEffect } from "react";
import styles from "./Menu.module.css";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

import DrinkAPI from "services/drinkService";

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [activeItem, setActiveItem] = useState(0);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const location = useLocation();
    const navigate = useNavigate(); // Sử dụng useNavigate

    // Hàm lọc sản phẩm dựa theo activeItem
    const filterProducts = (activeItem) => {
        if (activeItem === null) return [];
        
        if (typeof activeItem === "number") {
            const activeMenuItem = menuItems[activeItem];
            return activeMenuItem?.products || [];
        }
        if (typeof activeItem === "string") {
            const [parentIndex, subIndex] = activeItem.split("-").map(Number);
            const parentItem = menuItems[parentIndex];

            return parentItem?.subMenu?.[subIndex]?.products || [];
        }
        return [];
    };

    useEffect(() => {
        const shopId = localStorage.getItem("shopId") || "67e832a5d0be3d6ab71556a0";
        if (!shopId) return;
    
        const fetchMenu = async () => {
            try {
                const res = await DrinkAPI.getMenuByShopId(shopId);
                if (res.success) {
                    setMenuItems(res.data);
                    setFilteredProducts(res.data[0]?.products || []); 
                }
            } catch (error) {
                console.error("Lỗi khi lấy menu từ API:", error);
            }
        };
    
        fetchMenu();
    }, []);
    
    useEffect(() => {
        if (!menuItems || menuItems.length === 0) return;
    
        const findAndSet = () => {
            for (let i = 0; i < menuItems.length; i++) {
                const item = menuItems[i];
    
                if (item.path === location.pathname) {
                    setActiveItem(i);
                    setOpenMenuIndex(null);
                    setFilteredProducts(item.products || []);
                    return;
                }
    
                if (item.subMenu) {
                    for (let j = 0; j < item.subMenu.length; j++) {
                        const subItem = item.subMenu[j];
                        if (subItem.path === location.pathname) {
                            setActiveItem(`${i}-${j}`);
                            setOpenMenuIndex(i);
                            setFilteredProducts(subItem.products || []);
                            return;
                        }
                    }
                }
            }
    
            setActiveItem(0);
            setOpenMenuIndex(null);
            const allProducts = menuItems.flatMap(item =>
                item.subMenu
                    ? item.subMenu.flatMap(sub => sub.products || [])
                    : item.products || []
            );
            setFilteredProducts(allProducts);
        };
    
        findAndSet();
    }, [location.pathname, menuItems]);

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
                                        <div key={product.id} className={styles.productItem} onClick={() => window.location.href = `/drink/detail/${product.id}`}
>
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
                                menuItems[activeItem.split("-")[0]].subMenu[activeItem.split("-")[1]].label
                            }
                        </h2>
                        <div className={styles.productList}>
                            {filteredProducts.map((product) => (
                                <div key={product.id} className={styles.productItem} onClick={() => window.location.href = `/drink/detail/${product.id}`}
>
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
                                        <div key={product.id} className={styles.productItem} >
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
