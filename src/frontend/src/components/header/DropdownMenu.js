import React from "react";
import styles from "./DropdownMenu.module.css";
import DropdownMenuItem from "./DropdownMenuItem";

const DropdownMenu = ({ onMouseLeave, menuItems }) => {
  return (
    <div className={styles.dropdownMenu} onMouseLeave={onMouseLeave}>
      {menuItems.map((item, index) => (
        <DropdownMenuItem key={index} item={item} />
      ))}
    </div>
  );
};

export default DropdownMenu;
