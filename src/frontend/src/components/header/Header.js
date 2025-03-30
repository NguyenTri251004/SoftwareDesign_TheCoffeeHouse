import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import logo from "assets/logo.svg";
import DropdownMenu from "./DropdownMenu";
import AccountDropdown from "./AccountDropdown";
import { usePopup } from "context/PopupContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountDropdownRef = useRef(null);

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.relatedTarget) &&
        !document.getElementById("user-icon").contains(event.relatedTarget)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    if (isAccountMenuOpen) {
      accountDropdownRef.current?.addEventListener(
        "mouseleave",
        handleMouseLeave
      );
    }

    return () => {
      accountDropdownRef.current?.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, [isAccountMenuOpen]);

  const { openPopup } = usePopup();

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
              onMouseEnter={() => setIsMenuOpen(true)}
            >
              <a href="/menu" className={isMenuOpen ? styles.menuActive : ""}>
                Menu ▾
              </a>
            </li>
            <li>
              <a href="/shop/list">Cửa hàng</a>
            </li>
            <li>
              <a href="#" onClick={openPopup}>Khuyến mãi</a>
            </li>
          </ul>
        </nav>

        <div className={styles.headerIcons}>
          <button
            className={styles.userBtn}
            id="user-icon"
            onClick={toggleAccountMenu}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className={styles.bagBtn}>
            <FontAwesomeIcon icon={faShoppingBag} />
          </button>
        </div>
      </div>
      {isMenuOpen && <DropdownMenu onMouseLeave={() => setIsMenuOpen(false)} />}
      {isAccountMenuOpen && (
        <div ref={accountDropdownRef}>
          <AccountDropdown />
        </div>
      )}
    </header>
  );
};

export default Header;
