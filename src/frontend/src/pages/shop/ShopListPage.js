import React, { useState, useEffect } from "react";
import ShopCard from "components/shopCard/ShopCard";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import bannerShopList from "assets/banner_shops_list.png";
import styles from "./ShopListPage.module.css"; 

import ShopAPI from "services/shopService";

function ShopListPage() {
    const [totalShop, setTotalShop] = useState(0);
    const [selectedCity, setSelectedCity] = useState("");
    const [cities, setCities] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [Districts, setDistricts] = useState([]);
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [visibleShops, setVisibleShops] = useState(4);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const data = await ShopAPI.getCities();
                setCities(data.cities);
                setTotalShop(data.totalShops);
                setLoading(false);
            } catch (err) {
                setError("Lỗi tải danh sách thành phố!");
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        if (cities != null) {
            setSelectedCity(cities[0]);
        }
    }, [cities]);

    useEffect(() => {
        const fetchDistricts = async (city) => {
            try {
                const data = await ShopAPI.getDistrictsByCity(city);
                setDistricts(data.districts);
            } catch (err) {
                setError("Loi tai quan huyen");
            }
        };

        if (selectedCity) { 
            fetchDistricts(selectedCity.name);
        }
        
    }, [selectedCity]);

    useEffect(() => {
        if (selectedDistrict) {
            setFilteredShops(shops.filter(shop => shop.address.district === selectedDistrict.name));
        } else {
            setFilteredShops(shops);
        }
    }, [shops, selectedDistrict]);

    useEffect(() => {
        const fetchShop = async (city) => {
            try {
                const data = await ShopAPI.getShopsByAddress(city);
                setShops(data.shops);
            } catch (err) {
                setError("loi tai shop");
            }
        };

        if (selectedCity) {
            fetchShop(selectedCity.name);
        }

    }, [selectedCity]);

    return (
        <div>
            <Header />

            <div className={styles.shopListPage}>
                <div className={styles.shopListPageBanner}>
                    <img src={bannerShopList} alt="Banner Shop List" />
                    <h1>Hệ thống {totalShop} cửa hàng The Coffee House toàn quốc</h1>
                </div>

                <div className={styles.shopContainer}>
                    <aside className={styles.shopSidebar}>
                        <h3>Theo khu vực</h3>
                        <ul>
                            {cities && cities.map((city) => (
                                <li 
                                    key={city.name} 
                                    className={city.name === selectedCity.name ? styles.active : ""} 
                                    onClick={() => {
                                        setSelectedCity(city); 
                                        setSelectedDistrict(""); 
                                    }}
                                >
                                    {city.name} ({city.shopCount})
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <div className={styles.shopList}>
                        <h2>Khám phá {selectedCity.shopCount} cửa hàng của chúng tôi ở {selectedCity.name}</h2>
                            
                        <select className={styles.dropdown}
                            value={selectedDistrict.name}
                            onChange={(e) => {
                                const district = Districts.find(d => d.name === e.target.value);
                                setSelectedDistrict(district || "");
                            }}
                        >
                            <option value="">Quận/Huyện</option>
                                {Districts.length > 0 ? (
                                    Districts.map((dept, index) => (
                                        <option key={index} value={dept.name}>
                                            {dept.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>không có</option>
                                )}
                        </select>

                        <div className={styles.shopGrid}>
                            {filteredShops && filteredShops.slice(0, visibleShops).map((item) => (
                                <ShopCard key={item._id} shop={item} />
                            ))}
                        </div>

                        <button className={styles.loadMore} 
                            onClick={() => setVisibleShops((prev) => prev + 4)}
                            style={{ display: visibleShops >= filteredShops.length ? "none" : "block" }}
                        >
                            Xem thêm
                        </button>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ShopListPage;
