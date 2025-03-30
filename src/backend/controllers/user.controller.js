import UserModel from "../models/user.model.js";
import AdminModel from "../models/admin.model.js";

const userController = {
    getProfile: async (req, res) => {
        try {
            const user = await UserModel.findById(req.user._id).select("-password");
            if (!user) return res.status(404).json({ msg: "Không tìm thấy người dùng" });

            let profile = {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                avatar: user.avatar
            };

            if (user.role === "customer") {
                // them ten ho
            }

            if (user.role === "admin") {
                const admin = await AdminModel.findById(user._id).populate("shopId");
                if (admin) {
                    profile.username = admin.username;
                    profile.shop = admin.shopId ? admin.shopId.name: null;
                }
            } else if (user.role === "superAdmin") {
                profile.username = "The coffee house";
            }

            res.json(profile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Lỗi server" });
        }
    }
};

export default userController;
