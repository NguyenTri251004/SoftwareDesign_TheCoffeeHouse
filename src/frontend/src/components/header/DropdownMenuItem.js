import React, { useState } from "react";
import styles from "./DropdownMenu.module.css";
import { NavLink } from "react-router-dom"; // Import NavLink

const DropdownMenuItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={styles.dropdownMenuItem}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        to={item.path} // Sử dụng NavLink và truyền path vào 'to'
        className={({ isActive }) =>
          [
            styles.link,
            isHovered ? styles.hovered : "",
            isActive ? styles.active : "",
          ].join(" ")
        } // Thêm class active
      >
        {item.label}
      </NavLink>
      {item.subMenu && (
        <div
          className={`${styles.subMenu} ${
            isHovered ? styles.subMenuVisible : ""
          }`}
        >
          {item.subMenu.map((subItem, index) => (
            <DropdownMenuItem key={index} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenuItem;
