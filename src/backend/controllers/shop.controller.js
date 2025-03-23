import ShopModel from "../models/shop.model.js";

const ShopController = {
    getAllShops: async (start, end) => {
        try {
            const shops = await ShopModel.find()
                .skip(parseInt(start))
                .limit(parseInt(end) - parseInt(start));
            
            if (!Array.isArray(shops)) {
                console.error("ShopModel.find không trả về mảng!:", shops);
                return [];
            }
            
            return shops.map(shop => ({
                ...shop.toObject(),
                id: shop._id.toString(),
            }));
        } catch (error) {
            console.error("Lỗi ở getAllShops:", error);
            return [];
        }
    },
    getOneShop: async (id) => {
        try {
            const shop = await ShopModel.findById(id);
            if (!shop) {
                throw new Error("Shop không tìm thấy");
            }
            return {
                ...shop.toObject(),
                id: shop._id.toString(),
            };
        } catch (error) {
            console.error("Lỗi ở getOneShop:", error);
            throw error;
        }
    },
    createShop: async (data) => {
        try {
            const shop = new ShopModel(data);
            await shop.save();
            return {
                ...shop.toObject(),
                id: shop._id.toString()
            };
        } catch (error) {
            console.error("Lỗi ở createShop:", error);
            throw error;
        }
    },

    updateShop: async (id, data) => {
        try {
            const shop = await ShopModel.findByIdAndUpdate(id, data, { 
                new: true,
                runValidators: true 
            });
            if (!shop) throw new Error("Shop không tìm thấy");
            return {
                ...shop.toObject(),
                id: shop._id.toString()
            };
        } catch (error) {
            console.error("Lỗi ở updateShop:", error);
            throw error;
        }
    },

    deleteShop: async (id) => {
        try {
            const shop = await ShopModel.findByIdAndDelete(id);
            if (!shop) throw new Error("Shop không tìm thấy");
            return {
                id: shop._id.toString()
            };
        } catch (error) {
            console.error("Lỗi ở deleteShop:", error);
            throw error;
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
    }
}

export default ShopController;