import UserModel from "../models/user.model.js";
import CustomerModel from "../models/customer.model.js";
import DiscountModel from "../models/discount.model.js";

const userController = {
  getProfile: async (req, res) => {
    try {
      // Lấy userId từ middleware xác thực
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ msg: "Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại" });
      }

      const user = await UserModel.findById(userId).select("-password");
      if (!user)
        return res.status(404).json({ msg: "Không tìm thấy người dùng" });

      let profile = {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        avatar: user.avatar,
        phone: user.phone,
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
      console.error("Lỗi getProfile:", error);
      res.status(500).json({ msg: "Lỗi server", error: error.message });
    }
  },

  updateCustomerProfile: async (req, res) => {
    try {
      // Lấy userId từ middleware xác thực
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated.",
        });
      }

      const user = await UserModel.findById(userId).select("-password");
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
  redeemPoints: async (req, res) => {
    try {
      const { pointsToRedeem } = req.body;

      // Lấy userId từ middleware xác thực
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại" 
        });
      }

      // Lấy thông tin người dùng
      const user = await UserModel.findById(userId).select("-password");
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy người dùng" });

      // Kiểm tra role là customer
      if (user.role !== "customer") {
        return res.status(403).json({
          success: false,
          message: "Chỉ khách hàng mới có thể đổi điểm",
        });
      }

      // Lấy thông tin khách hàng
      const customer = await CustomerModel.findById(user._id);
      if (!customer)
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin khách hàng",
        });

      // Kiểm tra điểm tích lũy
      if (customer.loyaltyPoints < pointsToRedeem) {
        return res.status(400).json({ 
          success: false, 
          message: "Không đủ điểm để đổi" 
        });
      }

      // Trừ điểm
      customer.loyaltyPoints -= pointsToRedeem;
      await customer.save();

      // Tạo mã giảm giá
      const discountCode = `DISCOUNT-${Date.now()}`;
      const discountAmount = pointsToRedeem * 100;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const discount = new DiscountModel({
        code: discountCode,
        description: `Giảm ${discountAmount.toLocaleString()}đ cho đơn từ 0đ`,
        isPercentage: false,
        discountAmount,
        expiryDate,
        isActive: true,
        userId: user._id, // Gán userId cho voucher
        icon: "https://minio.thecoffeehouse.com/image/admin/1709222265_deli-copy-7.jpg",
      });

      await discount.save();

      return res.status(200).json({
        success: true,
        message: "Đổi điểm thành công",
        data: {
          discountCode: discount.code,
          discountAmount: discount.discountAmount,
          expiryDate: discount.expiryDate,
        },
      });
    } catch (error) {
      console.error("Lỗi redeemPoints:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Lỗi server", 
        error: error.message 
      });
    }
  },
};

export default userController;
