import React, { useState } from "react";
import styles from "./Header.module.css";
import logo from "assets/logo.svg";
import DropdownMenu from "./DropdownMenu";
import AccountDropdown from "./AccountDropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen); // Đảo ngược trạng thái
  };
  // Không cần closeAccountMenu riêng.

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
            <li className={styles.dropdown} onMouseEnter={handleMouseEnter}>
              <a href="/menu" className={isMenuOpen ? styles.menuActive : ""}>
                Menu ▾
              </a>
            </li>
            <li>
              <a href="/shop/list">Cửa hàng</a>
            </li>
          </ul>
        </nav>

        <div className={styles.headerIcons}>
          <button
            className={styles.userBtn}
            id="user-icon"
            onClick={toggleAccountMenu} // Gọi hàm toggleAccountMenu
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className={styles.bagBtn} id="bag-icon">
            <FontAwesomeIcon icon={faShoppingBag} />
          </button>
        </div>
      </div>
      {isMenuOpen && <DropdownMenu onMouseLeave={handleMouseLeave} />}
      {isAccountMenuOpen && <AccountDropdown />}
    </header>
  );
};

export default Header;
