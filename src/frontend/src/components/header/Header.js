import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "assets/logo.svg";
import DropdownMenu from "./DropdownMenu";
import AccountDropdown from "./AccountDropdown";
import { usePopup } from "context/PopupContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";

import DrinkAPI from "services/drinkService";

const Header = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  const navigate = useNavigate();

  const checkIsLoggedIn = !!localStorage.getItem("token");

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const shopId = localStorage.getItem("nearestShopId");
    if (!shopId) return;

    const fetchMenu = async () => {
      try {
        const res = await DrinkAPI.getMenuByShopId(shopId);
        if (res.success) {
          setMenuItems(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy menu trong Header:", error);
      }
    };

    fetchMenu();
  }, []);

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

  const handleCartClick = () => {
    
      navigate("/cart");
    
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <a href="/">
          <div className={styles.logo}>
            <img src={logo} alt="The Coffee House" />
          </div>
        </a>

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
              <a href="#" onClick={openPopup}>
                Khuyến mãi
              </a>
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
          <button className={styles.bagBtn} onClick={handleCartClick}>
            <FontAwesomeIcon icon={faShoppingBag} />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <DropdownMenu
          onMouseLeave={() => setIsMenuOpen(false)}
          menuItems={menuItems}
        />
      )}
      {isAccountMenuOpen && (
        <div ref={accountDropdownRef}>
          <AccountDropdown isLoggedIn={checkIsLoggedIn} />
        </div>
      )}
    </header>
  );
};

export default Header;