import AdminModel from "../models/admin.model.js";
import UserModel from "../models/user.model.js";

const AdminController = {
    getListAdmins: async (req, res) => {
        try {
            const { start = 0, end = 10 } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;

            const [admins, total] = await Promise.all([
                AdminModel.find().skip(skip).limit(limit).populate("_id"),
                AdminModel.countDocuments()
            ]);

            const data = admins.map((admin) => {
                const user = admin._id;
                return {
                    id: user._id.toString(),
                    username: admin.username,
                    shopId: admin.shopId,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                };
            });

            res.set("X-Total-Count", total);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");

            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Lỗi getAllAdmins:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách admin", error });
        }
    },

    getOneAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const admin = await AdminModel.findById(id).populate("_id");
            if (!admin) return res.status(404).json({ success: false, message: "Không tìm thấy admin" });

            const user = admin._id;
            return res.status(200).json({
                success: true,
                data: {
                    id: user._id.toString(),
                    username: admin.username,
                    shopId: admin.shopId,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error("Lỗi getOneAdmin:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy admin", error });
        }
    },

    updateAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const { username, shopId, email, avatar } = req.body;

            const admin = await AdminModel.findByIdAndUpdate(
                id,
                { username, shopId },
                { new: true }
            );

            const user = await UserModel.findByIdAndUpdate(
                id,
                { email, avatar },
                { new: true }
            );

            if (!admin || !user) {
                return res.status(404).json({ success: false, message: "Không tìm thấy admin để cập nhật" });
            }

            return res.status(200).json({
                success: true,
                message: "Cập nhật admin thành công",
                data: {
                    id,
                    username: admin.username,
                    shopId: admin.shopId,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error("Lỗi updateAdmin:", error);
            return res.status(500).json({ success: false, message: "Lỗi cập nhật admin", error });
        }
    },

    deleteAdmin: async (req, res) => {
        try {
            const { id } = req.params;

            const admin = await AdminModel.findByIdAndDelete(id);
            const user = await UserModel.findByIdAndDelete(id);

            if (!admin || !user) {
                return res.status(404).json({ success: false, message: "Không tìm thấy admin để xoá" });
            }

            return res.status(200).json({
                success: true,
                message: "Xoá admin thành công",
                data: { id }
            });
        } catch (error) {
            console.error("Lỗi deleteAdmin:", error);
            return res.status(500).json({ success: false, message: "Lỗi xoá admin", error });
        }
    }
};

export default AdminController;
