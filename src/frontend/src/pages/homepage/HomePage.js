import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import userAPI from "services/userService";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import styles from "./HomePage.module.css"; // Import module.css
import bannerImage1 from "assets/images/banner-1.jpg";
import bannerImage2 from "assets/images/banner-2.jpg";
import bannerImage3 from "assets/images/banner-3.jpg";
import ModalAddress1 from "components/modal/ModalAddress1";
import FlashSale from "./FlashSale";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import teaBanner from "assets/images/tea-banner.png";
import teaTitle from "assets/images/tea-title.png";
import signatureBanner from "assets/images/signature-banner.jpg";

const HomePage = () => {
  const bannerImages = [bannerImage1, bannerImage2, bannerImage3];

  const [user, setLocalUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);

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

  useEffect(() => {
    const address = localStorage.getItem("userAddress");
    if (!address) {
      setShowAddressModal(true);
    }
  }, []);

  const handleLogout = async () => {
    setLocalUser(null);
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className={styles.homeContainer}>
      {!showAddressModal ? (
        <>
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
  
          {/* --- Tea Section --- */}
          <div className={styles.teaSection}>
            <div className={styles.teaImageContainer}>
              <img
                src={teaBanner}
                alt="Trà xanh Tây Bắc"
                className={styles.teaImage}
              />
            </div>
            <div className={styles.teaContent}>
              <img
                src={teaTitle}
                alt="Trà Xanh Tây Bắc"
                className={styles.teaTitleImage}
              />
              <p className={styles.teaDescription}>
                ...
              </p>
              <button className={styles.teaButton}>Thử ngay</button>
            </div>
          </div>
  
          {/* --- Signature Section --- */}
          <div className={styles.signatureSection}>
            <div className={styles.signatureContent}>
              <h2>
                SIGNATURE BY
                <br /> THE COFFEE HOUSE
              </h2>
              <p>
                ...
              </p>
              <button className={styles.signatureButton}>Tìm hiểu thêm</button>
            </div>
            <div className={styles.signatureImageContainer}>
              <img
                src={signatureBanner}
                alt="Signature By The Coffee House"
                className={styles.signatureImage}
              />
            </div>
          </div>
  
          <div className={styles.footerSection}>
            <Footer />
          </div>
        </>
      ) : (
        <ModalAddress1 onClose={() => setShowAddressModal(false)} />
      )}
    </div>
  );
  
};

export default HomePage;
