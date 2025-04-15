import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import userAPI from "services/userService";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import styles from "./HomePage.module.css";
import bannerImage1 from "assets/images/banner-1.jpg";
import bannerImage2 from "assets/images/banner-2.jpg";
import bannerImage3 from "assets/images/banner-3.jpg";
import ModalAddress1 from "components/modal/ModalAddress1";
import FlashSale from "./FlashSale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import teaBanner from "assets/images/tea-banner.png";
import teaTitle from "assets/images/tea-title.png";
import signatureBanner from "assets/images/signature-banner.jpg";
import ShopAPI from "services/shopService";

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
        const fetchUserDataAndAddress = async () => {
            let address = null;

            // Check if there's a token in localStorage
            const token = localStorage.getItem("token"); // Adjust key based on your app
            console.log("Token found in localStorage:", !!token);

            if (token) {
                // Logged-in user: Fetch profile to get user data
                try {
                    console.log("Fetching user profile...");
                    const userData = await userAPI.getProfile();
                    console.log("Profile data:", userData);

                    // Ensure userData aligns with CustomerSchema
                    setLocalUser(userData);
                    dispatch(setUser(userData));

                    // Find default address in addresses array
                    const defaultAddress = userData.addresses?.find((addr) => addr.isDefault);
                    address = defaultAddress ? defaultAddress.address : null;

                    if (!address) {
                        console.log("No default address found, showing modal...");
                        setShowAddressModal(true); // Show modal if no default address
                        return;
                    }
                } catch (err) {
                    console.error("Error fetching profile:", err.message);
                    setLocalUser(null);
                    dispatch(clearUser());
                    localStorage.removeItem("token"); // Clear token on error
                    setShowAddressModal(true); // Show modal on error
                    return;
                }
            } else {
                // Guest user: Check localStorage for address
                console.log("Guest user detected, checking localStorage for address...");
                address = localStorage.getItem("userAddress");
                if (!address) {
                    console.log("No address found for guest, showing modal...");
                    setShowAddressModal(true); // Show modal if no address
                    return;
                }
            }

            // If address is available, fetch nearest shop
            if (address) {
                try {
                    console.log("Fetching nearest shop for address:", address);
                    const result = await ShopAPI.getShopNearestUser(address);
                    localStorage.setItem("nearestShopId", result.shop._id);
                    localStorage.setItem("currentShopId", result.shop._id);
                    console.log("Cửa hàng gần bạn nhất/cửa hàng hiện tại:", result.shop);
                } catch (error) {
                    console.error("Error fetching nearest shop:", error.message);
                }
            }
        };

        fetchUserDataAndAddress();
    }, [dispatch]);

    const handleLogout = async () => {
        setLocalUser(null);
        dispatch(clearUser());
        localStorage.removeItem("token");
        localStorage.removeItem("userAddress"); // Clear guest address on logout
        navigate("/login");
    };

    // Handle address submission from modal
    const handleAddressSubmit = async (newAddress) => {
        console.log("Address submitted:", newAddress);
        if (!user) {
            // Guest: Save address to localStorage
            localStorage.setItem("userAddress", newAddress);
        } else {
            // Logged-in user: Update profile with new address
            try {
                // Add new address to addresses array
                const newAddressObj = {
                    id: user.addresses?.length ? Math.max(...user.addresses.map((addr) => addr.id)) + 1 : 1,
                    address: newAddress,
                    isDefault: true, // Set as default
                };

                // Ensure only one address is marked as default
                const updatedAddresses = user.addresses?.map((addr) => ({
                    ...addr,
                    isDefault: false,
                })) || [];
                updatedAddresses.push(newAddressObj);

                await userAPI.updateProfile({ addresses: updatedAddresses });
                const updatedUser = { ...user, addresses: updatedAddresses };
                setLocalUser(updatedUser);
                dispatch(setUser(updatedUser));
                console.log("User profile updated with new address");
            } catch (error) {
                console.error("Error updating address:", error.message);
            }
        }
        setShowAddressModal(false);

        // Fetch nearest shop after saving address
        try {
            console.log("Fetching nearest shop for new address:", newAddress);
            const result = await ShopAPI.getShopNearestUser(newAddress);
            localStorage.setItem("nearestShopId", result.shop._id);
            console.log("Nearest shop:", result.shop);
        } catch (error) {
            console.error("Error fetching nearest shop:", error.message);
        }
    };

    console.log("HomePage rendering, user state:", user);
    console.log("Passing isLoggedin to Header:", user !== null);
    return (
        <div className={styles.homeContainer}>
            {!showAddressModal ? (
                <>
                    <Header isLoggedIn={user !== null} />
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
                            <p className={styles.teaDescription}>...</p>
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
                            <p>...</p>
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
                <ModalAddress1
                    onClose={() => setShowAddressModal(false)}
                    onSubmit={handleAddressSubmit}
                />
            )}
        </div>
    );
};

export default HomePage;