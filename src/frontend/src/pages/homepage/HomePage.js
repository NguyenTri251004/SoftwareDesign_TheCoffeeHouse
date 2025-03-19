import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/userService";
import Header from "components/header/Header";
import styles from "./HomePage.module.css"; // Import a CSS file for styling
import bannerImage1 from "assets/banner/banner-1.jpg";
import bannerImage2 from "assets/banner/banner-2.jpg";
import bannerImage3 from "assets/banner/banner-3.jpg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const bannerImages = [bannerImage1, bannerImage2, bannerImage3];

  const [user, setLocalUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Function to handle next slide ---
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
  };

  // --- Function to handle previous slide ---
  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? bannerImages.length - 1 : prevSlide - 1
    );
  };
  // --- Function to handle dot click ---
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
    <div>
      <Header />

      {/* --- Banner Slider --- */}
      <div className={styles.bannerSlider}>
        <div className={styles.sliderContainer}>
          {/* Left Arrow */}
          <button className={styles.sliderArrowPrev} onClick={prevSlide}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Image Slides */}
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentSlide ? styles.slideActive : ""}`}
              style={{
                backgroundImage: `url(${image})`,
                transform: `translateX(${(index - currentSlide) * 100}%)`,
              }}
            >
              {/*  You can put content *inside* the slide here, like text or buttons */}
            </div>
          ))}

          {/* Right Arrow */}
          <button className={styles.sliderArrowNext} onClick={nextSlide}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        {/* --- Slider Dots --- */}
        <div className={styles.sliderDots}>
          {bannerImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>
      {/* --- End Banner Slider --- */}

      {/* <h2>Profile</h2>
      {user ? (
        <div>
          <p>
            Name: {user.firstName} {user.lastName}
          </p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user logged in</p>
      )} */}
    </div>
  );
};

export default HomePage;
