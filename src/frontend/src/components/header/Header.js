// Header.js
import React, { useState } from "react";
import styles from "./Header.module.css";
import logo from "assets/logo.svg";
import DropdownMenu from "./DropdownMenu";

// Import Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Không cần hàm toggleMenu nữa

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <img src={logo} alt="The Coffee House" />
        </div>

        <nav className={styles.nav}>
          <ul>
            <li>
              <a href="#">Cà phê</a>
            </li>
            <li>
              <a href="#">Trà</a>
            </li>
            <li
              className={styles.dropdown}
              onMouseEnter={handleMouseEnter} // Thêm sự kiện onMouseEnter
              // onMouseLeave={handleMouseLeave} // Xóa sự kiện này ở đây
            >
              <a href="#" className={isMenuOpen ? styles.menuActive : ""}>
                Menu ▾
              </a>
            </li>
            <li>
              <a href="/shop/list">Cửa hàng</a>
            </li>
          </ul>
        </nav>

        <div className={styles.headerIcons}>
          <button className={styles.userBtn} id="user-icon">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className={styles.bagBtn} id="bag-icon">
            <FontAwesomeIcon icon={faShoppingBag} />
          </button>
        </div>
      </div>
      {/* Chuyển onMouseLeave sang DropdownMenu */}
      {isMenuOpen && <DropdownMenu onMouseLeave={handleMouseLeave} />}
    </header>
  );
};

export default Header;
