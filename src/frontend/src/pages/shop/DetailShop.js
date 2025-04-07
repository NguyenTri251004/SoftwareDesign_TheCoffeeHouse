import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import parkingIcon from "assets/icon/ic-parking.svg";
import onsiteIcon from "assets/icon/ic-onsite.svg";
import takewayIcon from "assets/icon/ic-takeaway.svg";
import facebookIcon from "assets/icon/ic-fb.svg";
import zaloIcon from "assets/icon/ic-zalo.svg";
import messengerIcon from "assets/icon/ic-message.svg";
import linkIcon from "assets/icon/ic-copylink.svg";

import AddressMap from "components/map/AddressMap"; 

import styles from "./DetailShop.module.css";

import ShopAPI from "services/shopService";

function ShopDetailPage() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [nearbyShops, setNearbyShops] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetailShop = async (id) => {
            setLoading(true);
            try {
                const data = await ShopAPI.getShopById(id);
                setShop(data.shop);
            }  catch (err) {
                console.error("Lỗi tải chi tiết cửa hàng", err);
            }
            setLoading(false);
        };
        fetchDetailShop(_id);
    }, [_id]);

    useEffect(() => {
        const fetchNearbyShops = async (id) => {
            try {
                const data = await ShopAPI.getNearByShopById(id);
                setNearbyShops(data.nearbyShops);
            } catch (err) {
                console.error("Lỗi tải lân cận cửa hàng", err);
            }
        };
        fetchNearbyShops(_id);
    }, [_id]);

    if (loading || !shop) return <p></p>;
    else return (
        <div>
            <Header />

            <div className={styles.shopDetailContainer}>
                <div className={styles.shopDetailLeft}>
                    {shop && shop.images.map((image, index) => (
                        <img key={index} src={image} alt={shop.name} className={styles.detailShopImage} />
                    ))}

                    <div style={{ position: "relative", marginTop: "16px" }}>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address.detail} ${shop.address.district} ${shop.address.city}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ position: "absolute", top: "10px", left: "50px", backgroundColor: "white",
                                padding: "6px 10px", borderRadius: "4px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                zIndex: 1000, fontSize: "14px", color: "#007bff", textDecoration: "none", fontWeight: "500"
                            }}
                        >
                            Xem bản đồ lớn hơn
                        </a>
                        <AddressMap
                            address={`${shop.address.detail}, ${shop.address.district}, ${shop.address.city}`}
                        />
                </div>
                </div>

                <div className={styles.shopDetailRight}>
                    <h1 className={styles.shopDetailTitle}>{shop.name}</h1>
                    <p className={styles.shopDetailDesc}>
                        {shop.description}
                    </p>

                    <div className={styles.shopInfo}>
                        <div className={styles.shopAddress}>
                            <div className={styles.infoLabel}>Địa chỉ:</div>
                            <div>
                                <img src={linkIcon} alt="Link" />
                                <img src={facebookIcon} alt="Facebook" />
                                <img src={zaloIcon} alt="Zalo" />
                                <img src={messengerIcon} alt="Messenger" />
                            </div>
                        </div>
                        <div>{shop.address.detail}, {shop.address.district}, {shop.address.city}</div>
                        <div className={styles.infoLabel}>Giờ mở cửa:</div>
                        <div className={styles.shopHours}>{shop.openingHours.open} - {shop.openingHours.close}</div>
                        <div className={styles.shopTags}>
                            {shop.carParking && <span><img src={parkingIcon} alt={shop.name} /> Có chỗ đỗ xe</span>}
                            {shop.takeAway && <span><img src={onsiteIcon} alt={shop.name} /> Mua mang đi</span>}
                            {shop.service && <span><img src={takewayIcon} alt={shop.name} /> Phục vụ tại chỗ</span>}
                        </div>
                    </div>

                    <div className={styles.shopToMenu}>
                        <div className={styles.infoLabel}>Món ngon tại {shop.name}</div>
                        <div className={styles.foodMenuBtn}>Xem menu quán</div>
                    </div>
                    
                    {nearbyShops.length > 0 && (
                        <div className={styles.relatedShops}>
                            <div className={styles.infoLabel}>The Coffee House lân cận</div>
                            {nearbyShops.map((item, index) => (
                                <div key={item._id || index} className={styles.relatedShopItem} onClick={() => navigate(`/shop/detail/${item._id}`)}>
                                    <img src={item.images?.[0] || "/default-image.jpg"} alt={item.name} />
                                    <div>{item.name} <br /> {item.address.detail}, {item.address.district}, {item.address.city}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ShopDetailPage;
