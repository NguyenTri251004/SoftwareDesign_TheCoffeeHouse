// DropdownMenu.js
import React from "react";
import styles from "./DropdownMenu.module.css"; // Đường dẫn đến file CSS
import DropdownMenuItem from "./DropdownMenuItem"; // Import component con

const DropdownMenu = ({ onMouseLeave }) => {
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

  return (
    <div className={styles.dropdownMenu} onMouseLeave={onMouseLeave}>
      {menuItems.map((item, index) => (
        <DropdownMenuItem key={index} item={item} />
      ))}
    </div>
  );
};

export default DropdownMenu;
