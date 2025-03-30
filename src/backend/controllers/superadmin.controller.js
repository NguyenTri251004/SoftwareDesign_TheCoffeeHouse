import UserModel from "../models/user.model";

const SuperadminController = {
    createSuperadmin: async (start, end) => {
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
    
}

export default SuperadminController;