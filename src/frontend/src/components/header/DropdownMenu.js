import React from "react";
import styles from "./DropdownMenu.module.css";
import DropdownMenuItem from "./DropdownMenuItem";
import { menuItems } from "pages/menu/menuData";

const DropdownMenu = ({ onMouseLeave }) => {
  return (
    <div className={styles.dropdownMenu} onMouseLeave={onMouseLeave}>
      {menuItems.map((item, index) => (
        <DropdownMenuItem key={index} item={item} />
      ))}
    </div>
  );
};

export default DropdownMenu;
