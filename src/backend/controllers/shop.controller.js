import { get } from "mongoose";
import ShopModel from "../models/shop.model.js";
import axios from 'axios';

const GEOCODIFY_API_KEY = 'eyd9P0oasHRZa4qYLLYS4ENljzXmegDD';
const GEOCODIFY_BASE_URL = 'https://api.geocodify.com/v2/geocode';

async function geocodeAddress(address) {
    try {
        const response = await axios.get(GEOCODIFY_BASE_URL, {
        params: {
            api_key: GEOCODIFY_API_KEY,
            q: address,
        }
        });
        if (
            response.data &&
            response.data.response &&
            response.data.response.features &&
            response.data.response.features.length > 0
        ) {
            const coordinates = response.data.response.features[0].geometry.coordinates;
            return { lat: coordinates[1], lng: coordinates[0] };
        } else {
            console.log(`Không tìm thấy tọa độ cho địa chỉ: ${address}`);
            return null;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
  
  // Hàm tính khoảng cách giữa 2 tọa độ theo công thức Haversine (đơn vị km)
function haversineDistance(coords1, coords2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLng = toRad(coords2.lng - coords1.lng);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coords1.lat)) *
        Math.cos(toRad(coords2.lat)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const ShopController = {
    getListShops: async (req, res) => {
        try {
            const { start = 0, end = 10 } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;

            const [shops, total] = await Promise.all([
                ShopModel.find().skip(skip).limit(limit),
                ShopModel.countDocuments()
            ]);

            res.set("X-Total-Count", total);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");

            return res.status(200).json({ success: true, data: shops });
        } catch (error) {
            console.error("Lỗi getListShops:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách shop", error });
        }
    },

    getOneShop: async (req, res) => {
        try {
            const { id } = req.params;
            const shop = await ShopModel.findById(id);
            if (!shop) 
                return res.status(404).json({ success: false, message: "Không tìm thấy shop" });

            return res.status(200).json({ success: true, data: shop });
        } catch (error) {
            console.error("Lỗi ở getOneShop:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy shop", error });
        }
    },

    getManyShops: async (req, res) => {
        try {
            const { ids } = req.body; 
            const shops = await ShopModel.find({ _id: { $in: ids } });
            
            return res.status(200).json({ data: shops });
        } catch (error) {
            console.error("Lỗi getManyShops:", error);
            return res.status(500).json({ message: "Lỗi khi lấy danh sách tất cả shop", error });
        }
    },

    createShop: async (req, res) => {
        try {
            const shop = new ShopModel(req.body);
            await shop.save();

            return res.status(201).json({ data: shop });
        } catch (error) {
            console.error("Lỗi ở createShop:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi tạo shop", error });
        }
    },

    updateShop: async (req, res) => {
        try {
            const { id } = req.params;
            const shop = await ShopModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            if (!shop) return res.status(404).json({ message: "Shop không tồn tại" });

            return res.status(200).json({ data: shop });
        } catch (error) {
            console.error("Lỗi ở updateShop:", error);
            return res.status(500).json({ message: "Lỗi khi cập nhật shop", error });
        }
    },

    deleteShop: async (req, res) => {
        try {
            const { id } = req.params;
            const shop = await ShopModel.findByIdAndDelete(id);

            if (!shop) return res.status(404).json({ message: "Shop không tồn tại" });

            return res.status(200).json({ 
                success: true,
                message: "Xoá shop thành công",
                data: { id }
            });
        } catch (error) {
            console.error("Lỗi ở deleteShop:", error);
            return res.status(500).json({ message: "Lỗi khi xoá shop", error });
        }
    },

    getCities: async (req, res) => {
        try {
            const cities = await ShopModel.aggregate([
                { $group: { _id: "$address.city", shopCount: { $sum: 1 } } },
                { $sort: { shopCount: -1 } }
            ]);
            const totalShops = cities.reduce((sum, city) => sum + city.shopCount, 0);

            return res.status(200).json({ success: true, message: "lấy tỉnh, thành phố thành công", totalShops,
                cities: cities.map(city => ({ name: city._id, shopCount: city.shopCount })) });
        } catch (error) {
            return res.status(500).json({ success: false, message: "lỗi lấy danh sách tỉnh, thành phố", error });
        }
    },

    getDistrictsByCity: async (req, res) => {
        try {
            const { city } = req.query;

            const districts = await ShopModel.aggregate([
                { $match: { "address.city": city }},
                { $group: { _id: "$address.district" }},
                { $sort: { _id: 1 }}
            ]);
            return res.status(200).json({ success: true, message: "lấy quận, huyện thành công", 
                districts: districts.map(district => ({ name: district._id })) });
        } catch (error) {
            return res.status(500).json({ success: false, message: "lỗi lấy danh sách quận, huyện", error });
        }
    },

    getShopByAddress: async (req, res) => {
        try {
            const { city } = req.query;
            const filter = { "address.city": city };

            const shops = await ShopModel.find(filter).select("_id name address images openingHours carParking takeAway service");
            return res.status(200).json({ success: true, message: "lấy shops thành công", shops });
        } catch (error) {
            return res.status(500).json({ success: false, message: "lỗi lấy danh sách shop", error });
        }
    },

    getShopById: async (req, res) => {
        try {
            const { id } = req.query;
            const shop = await ShopModel.findById(id).select("_id name address images description openingHours carParking takeAway service");

            if (!shop) {
                return res.status(404).json({ success: false, message: "lấy detail shop khong thành công" });
            }
            return res.status(200).json({ success: true, message: "lấy detail shop thành công", shop });
        } catch (error) {
            return res.status(500).json({ success: false, message: "lỗi lấy detail shop", error });
        }
    },

    getNearByShops: async (req, res) => {
        try {
            const { id } = req.query;
            const currentShop = await ShopModel.findById(id);

            const nearbyShops = await ShopModel.find({
                _id: { $ne: id }, 
                "address.district": currentShop.address.district,
                "address.city": currentShop.address.city,
            }).select("_id name address images").slice("images", 1).limit(5);

            return res.status(200).json({ success: true, message: "lấy near by shops thành công", nearbyShops });
        } catch (error) {
            return res.status(500).json({ success: false, message: "lỗi lấy near by shop", error });
        }
    },

    addProductToShop: async (req, res) => {
        try {
            const { id } = req.params;
            const { productId, stock = 0 } = req.body;
    
            const shop = await ShopModel.findById(id);
            if (!shop) return res.status(404).json({ message: 'Shop không tồn tại' });
    
            const index = shop.products.findIndex(t => t.id.toString() === productId);

            if (index !== -1) {
                shop.products[index].stock += stock;
            } else {
                shop.products.push({ id: productId, stock });
            }

            await shop.save();
            return res.status(200).json({ success: true, message: 'Đã thêm sản phẩm', data: shop });
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
            return res.status(500).json({ success: false, message: 'Lỗi server', err });
        }
    },
    
    addToppingToShop: async (req, res) => {
        try {
            const { id } = req.params; 
            const { toppingId, stock = 0 } = req.body;
    
            const shop = await ShopModel.findById(id);
            if (!shop) return res.status(404).json({ message: 'Shop không tồn tại' });
    
            const index = shop.toppings.findIndex(t => t.id.toString() === toppingId);

            if (index !== -1) {
                shop.toppings[index].stock += stock;
            } else {
                shop.toppings.push({ id: toppingId, stock });
            }

            await shop.save();
    
            return res.status(200).json({ success: true, message: 'Đã thêm topping', data: shop });
        } catch (err) {
            console.error('Lỗi khi thêm topping:', err);
            return res.status(500).json({ success: false, message: 'Lỗi server', err });
        }
    },

    getAddress: async (req, res) => {
        try {
            const addresses = await ShopModel.aggregate([
                { $group: { _id: "$address.city", districts: { $addToSet: "$address.district" }}},
                { $sort: { _id: 1 }}
            ]);
            return res.status(200).json({ success: true, message: "lấy địa chỉ thành công", addresses });
        } catch (error) {
            return res.status(500).json({ success: false, message: "lỗi lấy danh sách địa chỉ", error });
        }
    },

    getShopNearestUser: async (req, res) => {
        try {
            const userAddress = req.query.address; // Địa chỉ của người dùng
            if(!userAddress) {
                return res.status(400).json({ success: false, message: "Địa chỉ người dùng không được cung cấp" });
            }
            const shops = await ShopModel.find({}); 
            const userCoords = await geocodeAddress(userAddress); 

            let nearestShop = null;
            let minDistance = Infinity;

            const results = await Promise.all(
                shops.map(async (shop) => {
                    const fullAddress = `${shop.address.detail}, ${shop.address.district}, thành phố ${shop.address.city}`;
                    try {
                        const shopCoords = await geocodeAddress(fullAddress);
                        if (!shopCoords) return null;
            
                        const distance = haversineDistance(userCoords, shopCoords);
                        // console.log(`Khoảng cách từ ${userAddress} đến ${fullAddress}: ${distance} km`);
                        return { shop, distance };
                    } catch (e) {
                        return null;
                    }
                })
            );
            
            // Tìm shop gần nhất
            for (const result of results) {
                if (result && result.distance < minDistance) {
                    minDistance = result.distance;
                    nearestShop = result.shop;
                }
            }
            if (!nearestShop) {
                return res.status(404).json({ success: true, message: "Không tìm thấy shop gần nhất" });
            }
            return res.status(200).json({ success: true, message: "Lấy shop gần nhất thành công", shop: nearestShop });
        }
        catch (error) {
            console.error("Lỗi ở getShopNearestUser:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy shop gần nhất", error });
        }
    }
}

export default ShopController;