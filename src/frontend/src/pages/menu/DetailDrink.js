import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import DrinkAPI from "services/drinkService";
import userAPI from "services/userService";
import CartAPI from "services/cartService";

import styles from "./DetailDrink.module.css";

function DrinkDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [drink, setDrink] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [error, setError] = useState(null);
    const [isGuest, setIsGuest] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const flashSaleId = queryParams.get("flashSaleId");
    const salePriceFromQuery = parseFloat(queryParams.get("salePrice"));

    const [flashSalePrice, setFlashSalePrice] = useState(salePriceFromQuery || null);

    useEffect(() => {
        const fetchUserAndDrink = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const userData = await userAPI.getProfile();
                    setUser(userData);
                    console.log("User loaded from API:", userData);
                } else {
                    console.log("No token found, user is not logged in.");
                    setUser(null);
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin user:", err);
                setUser(null);
                localStorage.removeItem("token");
            }

            try {
                const shopId = localStorage.getItem("currentShopId") || "67e832a5d0be3d6ab71556a0";
                const res = await DrinkAPI.getDrinkById(shopId, id);
                setDrink(res.drink);
            } catch (err) {
                console.error("Lỗi tải chi tiết món uống:", err);
            }
        };

        fetchUserAndDrink();
    }, [id]);

    // Lấy gợi ý và cập nhật isGuest khi user thay đổi
    useEffect(() => {
        if (user === null) return;

        const guestStatus = !user?.id;
        setIsGuest(guestStatus);
        console.log("User ID:", user?.id);

        if (!guestStatus && user.id) {
            const fetchRecommendations = async () => {
                setLoadingRecommendations(true);
                setError(null);

                try {
                    // 1. Lấy danh sách product_id từ recommendations.json
                    const recommendationsResponse = await fetch("/scripts/recommendations.json");
                    const recommendationsData = await recommendationsResponse.json();
                    const userRecommendations = recommendationsData[user.id] || [];
                    setRecommendations(userRecommendations);

                    console.log("Recommended product IDs:", userRecommendations);

                    // 2. Gọi API để lấy thông tin chi tiết của các sản phẩm từ database
                    if (userRecommendations.length > 0) {
                        const recommendedProductsData = await DrinkAPI.getMultipleDrinks(userRecommendations);
                        setRecommendedProducts(recommendedProductsData); // recommendedProductsData đã là mảng
                        console.log("Recommended products from database:", recommendedProductsData);
                    } else {
                        setRecommendedProducts([]);
                    }
                } catch (err) {
                    setError("Không thể lấy gợi ý. Vui lòng thử lại!");
                    console.error("Lỗi khi lấy gợi ý:", err);
                    setRecommendedProducts([]);
                } finally {
                    setLoadingRecommendations(false);
                }
            };

            fetchRecommendations();
        } else {
            console.log("No valid user ID available, skipping recommendations.");
            setRecommendations([]);
            setRecommendedProducts([]);
        }
    }, [user]);

    const toggleTopping = (topping) => {
        setSelectedToppings((prev) =>
            prev.includes(topping)
                ? prev.filter((item) => item !== topping)
                : [...prev, topping]
        );
    };

    const calculateTotal = () => {
        let base = flashSalePrice ?? drink?.price ?? 0;
        let sizePrice = selectedSize?.extraPrice || 0;
        let toppingsPrice = selectedToppings.reduce((sum, top) => sum + (top.price || 0), 0);
        return base + sizePrice + toppingsPrice;
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
            return;
        }
    
        const cartItem = {
            productId: drink._id,
            size: selectedSize.size,
            toppings: selectedToppings.map((top) => ({
                toppingId: top._id,
                quantity: 1,
            })),
            quantity: 1,
            unitPrice: flashSalePrice ?? drink.price,
            totalPrice: calculateTotal(),
        };
    
        try {
            if (user && user.id) {
                const payload = {
                    userId: user.id,
                    item: cartItem,
                };
                await CartAPI.addToCart(payload);
                alert("Đã thêm vào giỏ hàng!");
            } else {
                let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
                // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
                const existingItemIndex = existingCart.findIndex(
                    (item) =>
                        item.productId === cartItem.productId &&
                        item.size === cartItem.size &&
                        JSON.stringify(item.toppings) === JSON.stringify(cartItem.toppings)
                );
    
                let updatedCart;
                if (existingItemIndex !== -1) {
                    // Nếu sản phẩm đã tồn tại, tăng quantity
                    updatedCart = [...existingCart];
                    updatedCart[existingItemIndex].quantity += 1;
                    updatedCart[existingItemIndex].totalPrice =
                        updatedCart[existingItemIndex].quantity * updatedCart[existingItemIndex].unitPrice;
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm mới
                    updatedCart = [
                        ...existingCart,
                        {
                            ...cartItem,
                            name: drink.name,
                            image: drink.image,
                            topping: selectedToppings.map((top) => ({
                                toppingId: top._id,
                                name: top.name,
                                price: top.price,
                            })),
                        },
                    ];
                }
    
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                alert("Đã thêm vào giỏ hàng (localStorage)!");
            }
            setSelectedSize(null);
            setSelectedToppings([]);
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
        }
    };
    

    if (!drink) return null;

    return (
        <div>
            <Header />
            <div className={styles.detailContainer}>
                <div className={styles.topSection}>
                    <div className={styles.left}>
                        <img src={drink.image} alt={drink.name} className={styles.image} />
                    </div>
                    <div className={styles.right}>
                        <h2 className={styles.title}>{drink.name}</h2>
                        <p className={styles.price}>
                        {flashSalePrice ? (
                            <>
                                <span className={styles.originalPrice}>{drink.price.toLocaleString()} đ</span>
                                <span className={styles.salePrice}>{flashSalePrice.toLocaleString()} đ</span>
                                <span className={styles.flashSaleTag}>Flash Sale</span>
                            </>
                        ) : (
                            `${drink.price.toLocaleString()} đ`
                        )}
                        </p>

                        <div className={styles.section}>
                            <div className={styles.label}>Chọn size (bắt buộc)</div>
                            <div className={styles.options}>
                                {drink.sizes.map((size) => (
                                    <button
                                        key={size.size}
                                        className={`${styles.optionBtn} ${selectedSize?.size === size.size ? styles.selected : ""}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size.size} + {size.extraPrice.toLocaleString()} đ
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.label}>Topping</div>
                            <div className={styles.options}>
                                {drink.toppings.map((top) => (
                                    <button
                                        key={top._id}
                                        className={`${styles.optionBtn} ${selectedToppings.includes(top) ? styles.selected : ""}`}
                                        onClick={() => toggleTopping(top)}
                                    >
                                        {top.name} + {top.price.toLocaleString()} đ
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.totalPrice}>
                            Tổng cộng: {calculateTotal().toLocaleString()} đ
                        </div>
                        <button className={styles.addToCart} onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                    </div>
                </div>
                <div className={styles.descSection}>
                    <h3>Mô tả sản phẩm</h3>
                    <p className={styles.description}>{drink.description}</p>
                </div>
                <div className={styles.relatedSection}>
                    {isGuest ? (
                        <>
                            <h3>Sản phẩm liên quan</h3>
                            <div className={styles.related}>
                                {drink.relatedDrinks.map((item) => (
                                    <div
                                        key={item._id}
                                        className={styles.relatedItem}
                                        onClick={() => window.location.href = `/drink/detail/${item._id}`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img src={item.image} alt={item.name} />
                                        <div className={styles.relatedItemTitle}>{item.name}</div>
                                        <div>
                                            {typeof item.price === "number"
                                                ? `${item.price.toLocaleString()} đ`
                                                : "Giá không xác định"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Sản phẩm gợi ý bạn có thể thích</h3>
                            {loadingRecommendations ? (
                                <p>Đang tải gợi ý...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : recommendedProducts.length === 0 ? (
                                <p>Chưa có gợi ý nào. Hãy tương tác thêm để nhận gợi ý!</p>
                            ) : Array.isArray(recommendedProducts) ? (
                                <div className={styles.related}>
                                    {recommendedProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className={styles.relatedItem}
                                            onClick={() => window.location.href = `/drink/detail/${product._id}`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {product.image && (
                                                <img src={product.image} alt={product.name} />
                                            )}
                                            <div className={styles.relatedItemTitle}>
                                                {product.name || product._id}
                                            </div>
                                            <div>
                                                {product.price
                                                    ? `${product.price.toLocaleString()} đ`
                                                    : "Giá không xác định"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Lỗi: Dữ liệu gợi ý không hợp lệ</p>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DrinkDetailPage;