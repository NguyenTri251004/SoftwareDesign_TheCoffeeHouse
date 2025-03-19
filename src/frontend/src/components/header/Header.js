import React from "react";
import "./Header.css";
import logo from "assets/logo.svg";

// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons'; 
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src={logo} alt="The Coffee House" />
        </div>

        <nav className="nav">
          <ul>
            <li><a href="#">Cà phê</a></li>
            <li><a href="#">Trà</a></li>
            <li className="dropdown">
              <a href="#">Menu ▾</a>
            </li>
            <li><a href="#">Cửa hàng</a></li>
          </ul>
        </nav>

        <div className="header-icons">
          <button className="icon-btn" id="user-icon">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className="icon-btn" id="bag-icon">
            <FontAwesomeIcon icon={faShoppingBag} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
