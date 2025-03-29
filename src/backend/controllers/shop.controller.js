import ShopModel from "../models/shop.model.js";

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
    
            const result = await ShopModel.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        products: { id: productId, stock }
                    }
                },
                { new: true }
            );
    
            if (!result) return res.status(404).json({ message: 'Shop không tồn tại' });
    
            return res.status(200).json({ success: true, data: result });
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
            return res.status(500).json({ success: false, message: 'Lỗi server', err });
        }
    },
    
    addToppingToShop: async (req, res) => {
        try {
            const { id } = req.params;
            const { toppingId, stock = 0 } = req.body;
    
            const result = await ShopModel.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        toppings: { id: toppingId, stock }
                    }
                },
                { new: true }
            );
    
            if (!result) return res.status(404).json({ message: 'Shop không tồn tại' });
    
            return res.status(200).json({ success: true, data: result });
        } catch (err) {
            console.error('Lỗi khi thêm topping:', err);
            return res.status(500).json({ success: false, message: 'Lỗi server', err });
        }
    },
}

export default ShopController;