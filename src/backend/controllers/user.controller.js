import findById from "../models/user.model.js"

const userController = {
    getProfile: async (req, res) => {
        try {
            const user = await findById(req.user.id).select("-password");
            if (!user) return res.status(404).json({ msg: "Không tìm thấy người dùng" });

            res.json(user);
        } catch (error) {
            res.status(500).json({ msg: "Server error" });
        }
    }
}

export default userController;
