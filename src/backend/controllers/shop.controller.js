import ShopModel from "../models/shop.model.js";

const ShopController = {
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