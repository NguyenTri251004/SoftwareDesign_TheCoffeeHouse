import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/userService";
import Header from "components/header/Header";
import styles from "./HomePage.module.css"; // Import module.css
import bannerImage1 from "assets/images/banner-1.jpg";
import bannerImage2 from "assets/images/banner-2.jpg";
import bannerImage3 from "assets/images/banner-3.jpg";
import FlashSale from "./FlashSale";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const bannerImages = [bannerImage1, bannerImage2, bannerImage3];

  const [user, setLocalUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? bannerImages.length - 1 : prevSlide - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await userAPI.getProfile();
        setLocalUser(userData);
        dispatch(setUser(userData));
      } catch (err) {
        setLocalUser(null);
        dispatch(clearUser());
      }
    };

    fetchProfile();
  }, [dispatch]);

  const handleLogout = async () => {
    setLocalUser(null);
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className={styles.homeContainer}>
      <Header />

      {/* --- Banner Slider --- */}
      <div className={styles.bannerSlider}>
        <div className={styles.sliderContainer}>
          <button
            className={`${styles.sliderArrow} ${styles.prev}`}
            onClick={prevSlide}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`${styles.slide} ${
                index === currentSlide ? styles.active : ""
              }`}
              style={{
                backgroundImage: `url(${image})`,
                transform: `translateX(${(index - currentSlide) * 100}%)`,
              }}
            ></div>
          ))}

          <button
            className={`${styles.sliderArrow} ${styles.next}`}
            onClick={nextSlide}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        <div className={styles.sliderDots}>
          {bannerImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                index === currentSlide ? styles.active : ""
              }`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>
      <div className={styles.adsContainer}>
        <div className={styles.adsPoster}></div>
      </div>
      <FlashSale />
    </div>
  );
};

export default HomePage;
