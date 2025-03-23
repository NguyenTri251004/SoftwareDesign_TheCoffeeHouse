import React, { useState } from "react";
import styles from "./DropdownMenu.module.css";

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
      <a href={item.link || "#"} className={isHovered ? styles.hovered : ""}>
        {item.label}
      </a>
      {item.subMenu && (
        <div className={styles.subMenu}>
          {item.subMenu.map((subItem, index) => (
            <DropdownMenuItem key={index} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenuItem;
