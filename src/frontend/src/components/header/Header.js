import React from "react";
import styles from "./Header.module.css";
import logo from "assets/logo.svg";

// Import Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
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
            <li className={styles.dropdown}>
              <a href="#">Menu ▾</a>
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
    </header>
  );
};

export default Header;
