import React, { useState } from "react";
import styles from "./Menu.module.css"; // Import CSS Modules
import Header from "components/header/Header";
import Footer from "components/footer/Footer";

const Menu = () => {
  const menuItems = [
    { label: "Tất cả", link: "#" },
    {
      label: "Cà Phê",
      link: "#",
      subMenu: [
        { label: "Cà phê Highlight", link: "#" },
        { label: "Cà phê Việt Nam", link: "#" },
        { label: "Cà phê máy", link: "#" },
        { label: "Cold Brew", link: "#" },
      ],
    },
    {
      label: "A-Mê",
      link: "#",
      subMenu: [{ label: "A-Mê", link: "#" }],
    },
    {
      label: "Trái Cây Xay 0°C",
      link: "#",
      subMenu: [{ label: "Trái Cây Xay 0°C", link: "#" }],
    },
    {
      label: "Trà Trái Cây - Hitea",
      link: "#",
      subMenu: [
        { label: "Trà trái cây", link: "#" },
        { label: "Hi-tea", link: "#" },
      ],
    },
    {
      label: "Trà Sữa",
      link: "#",
      subMenu: [{ label: "Trà Sữa", link: "#" }],
    },
    {
      label: "Trà Xanh - Chocolate",
      link: "#",
      subMenu: [
        { label: "Trà Xanh Tây Bắc", link: "#" },
        { label: "Chocolate", link: "#" },
      ],
    },
    {
      label: "Thức uống đá xay",
      link: "#",
      subMenu: [{ label: "Đá xay frosty", link: "#" }],
    },
    {
      label: "Bánh & Snack",
      link: "#",
      subMenu: [
        { label: "Bánh mặn", link: "#" },
        { label: "Bánh ngọt", link: "#" },
        { label: "Bánh pastry", link: "#" },
      ],
    },
  ];

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [activeItem, setActiveItem] = useState(0);

  const handleMenuItemClick = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
    // Nếu click vào menu cha, set activeItem là chính nó
    setActiveItem(index);
  };

  const handleSubMenuItemClick = (parentIndex, subIndex) => {
    // Khi click vào submenu, set activeItem là submenu đó, kèm theo parentIndex
    setActiveItem(`${parentIndex}-${subIndex}`);
  };

  return (
    <div className={styles.menuContainer}>
      <Header />
      <div className={styles.menuSidebar}>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link || "#"}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.subMenu) {
                    handleMenuItemClick(index);
                  } else {
                    setActiveItem(index);
                    window.location.href = item.link;
                  }
                }}
                // Thêm class active nếu item đó đang active
                className={activeItem === index ? styles.active : ""}
              >
                {item.label}
              </a>

              {item.subMenu && openMenuIndex === index && (
                <ul>
                  {item.subMenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.link || "#"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubMenuItemClick(index, subIndex); // Xử lý click submenu
                          window.location.href = subItem.link;
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
        {/* Nội dung chính của trang menu */}
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default Menu;
