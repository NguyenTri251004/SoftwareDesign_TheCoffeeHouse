import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import parkingIcon from "assets/icon/ic-parking.svg";
import onsiteIcon from "assets/icon/ic-onsite.svg";
import takewayIcon from "assets/icon/ic-takeaway.svg";
import facebookIcon from "assets/icon/ic-fb.svg";
import zaloIcon from "assets/icon/ic-zalo.svg";
import messengerIcon from "assets/icon/ic-message.svg"
import linkIcon from "assets/icon/ic-copylink.svg";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./ShopCard.module.css";

const ShopCard = ({ shop }) => {
    const navigate = useNavigate();
    
    return (
        <div className={styles.shopCard}>
            <Carousel className={styles.shopCarousel} interval={null} fade={false}>
                {shop.images.map((image, index) => (
                    <Carousel.Item key={index}>
                        <img 
                            src={image} 
                            alt={shop.name} 
                            className={styles.shopCardImage}
                            onClick={() => navigate(`/shop/detail/${shop._id}`)} 
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
  
            <h3 className={styles.shopName} onClick={() => navigate(`/shop/detail/${shop._id}`)} >{shop.name}</h3>
            <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address.detail} ${shop.address.district} ${shop.address.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <button className={styles.mapBtn}>Xem bản đồ</button>
            </a>

            <div className={styles.shopShare}>
                <span>Chia sẻ trên:</span>
                <div className={styles.shareIcons}>
                    <img src={facebookIcon} alt="Facebook" />
                    <img src={zaloIcon} alt="Messenger" />
                    <img src={messengerIcon} alt="Comment" />
                    <img src={linkIcon} alt="Copy Link" />
                </div>
            </div>
  
            <div className={styles.shopInfo}>
                <p>{shop.address.detail}, {shop.address.district}, {shop.address.city}</p>
                <p>{shop.openingHours.open} - {shop.openingHours.close}</p>
            </div>
  
            <div className={styles.shopFeatures}>
                {shop.carParking && <span><img src={parkingIcon} alt="Parking" /> Có chỗ đỗ xe</span>}
                {shop.takeAway && <span><img src={onsiteIcon} alt="Takeaway" /> Mua mang đi</span>}
                {shop.service && <span><img src={takewayIcon} alt="Service" /> Phục vụ tại chỗ</span>}
            </div>
        </div>
    );
};
  
export default ShopCard;
