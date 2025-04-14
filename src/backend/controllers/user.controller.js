import UserModel from "../models/user.model.js";
import CustomerModel from "../models/customer.model.js";

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
        avatar: user.avatar,
      };

      if (user.role === "customer") {
        const customer = await CustomerModel.findById(user._id);
        if (customer) {
          profile.fullname = customer.fullname || "";
          profile.addresses = customer.addresses || [];
          profile.loyaltyPoints = customer.loyaltyPoints || 0;
        } else {
          profile.fullname = "";
          profile.addresses = [];
          profile.loyaltyPoints = 0;
        }
      }

      if (user.role === "admin") {
        const admin = await AdminModel.findById(user._id).populate("shopId");
        if (admin) {
          profile.username = admin.username;
          profile.shop = admin.shopId ? admin.shopId.name : null;
        }
      } else if (user.role === "superAdmin") {
        profile.username = "The coffee house";
      }

      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Lỗi server" });
    }
  },

  updateCustomerProfile: async (req, res) => {
    try {
      // Sử dụng req.user từ authMiddleware
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated.",
        });
      }

      const user = await UserModel.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      // Chỉ cho phép user có role là customer cập nhật profile
      if (user.role !== "customer") {
        return res.status(403).json({
          success: false,
          message: "Chỉ khách hàng mới có thể cập nhật profile này",
        });
      }

      const { fullname, email, phone, addresses } = req.body;

      // Cập nhật thông tin trong UserModel
      if (email) user.email = email;
      if (phone) user.phone = phone;
      await user.save();

      // Cập nhật thông tin trong CustomerModel
      let customer = await CustomerModel.findById(user._id);

      if (fullname) customer.fullname = fullname;
      if (addresses) {
        customer.addresses = addresses;
        customer.markModified("addresses"); // Đánh dấu thay đổi để MongoDB lưu
      }
      const savedCustomer = await customer.save();
      if (!savedCustomer) {
        throw new Error("Không thể lưu địa chỉ vào database");
      }
      console.log("💾 Customer sau khi lưu:", savedCustomer);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: { fullname, email, phone, addresses },
      });
    } catch (error) {
      console.error("Lỗi updateCustomerProfile:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },
};

export default userController;