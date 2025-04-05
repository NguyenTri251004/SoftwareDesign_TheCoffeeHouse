import DiscountModel from "../models/discount.model.js";

const DiscountController = {
    getListDiscounts: async (req, res) => {
        try {
            const { start = 0, end = 10, shopId } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;

            const query = {};
            if (shopId) query.shopId = shopId;

            const [discounts, total] = await Promise.all([
                DiscountModel.find(query).skip(skip).limit(limit),
                DiscountModel.countDocuments(query)
            ]);

            res.set("X-Total-Count", total);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");

            return res.status(200).json({ success: true, data: discounts });
        } catch (error) {
            console.error("Lỗi getListDiscounts:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách Discount", error });
        }
    },

    getOneDiscount: async (req, res) => {
        try {
            const { id } = req.params;
            const discount = await DiscountModel.findById(id);
            if (!discount)
                return res.status(404).json({ success: false, message: "Không tìm thấy Discount" });

            return res.status(200).json({ success: true, data: discount });
        } catch (error) {
            console.error("Lỗi ở getOneDiscount:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy Discount", error });
        }
    },

    getManyDiscounts: async (req, res) => {
        try {
            const { ids } = req.body;
            const discounts = await DiscountModel.find({ _id: { $in: ids } });

            return res.status(200).json({ data: discounts });
        } catch (error) {
            console.error("Lỗi getManyDiscounts:", error);
            return res.status(500).json({ message: "Lỗi khi lấy danh sách Discount", error });
        }
    },

    createDiscount: async (req, res) => {
        try {
            const discount = new DiscountModel(req.body);
            await discount.save();

            return res.status(201).json({ data: discount });
        } catch (error) {
            console.error("Lỗi ở createDiscount:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi tạo Discount", error });
        }
    },

    updateDiscount: async (req, res) => {
        try {
            const { id } = req.params;
            const discount = await DiscountModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            if (!discount) return res.status(404).json({ message: "Discount không tồn tại" });

            return res.status(200).json({ data: discount });
        } catch (error) {
            console.error("Lỗi ở updateDiscount:", error);
            return res.status(500).json({ message: "Lỗi khi cập nhật Discount", error });
        }
    },

    deleteDiscount: async (req, res) => {
        try {
            const { id } = req.params;
            const discount = await DiscountModel.findByIdAndDelete(id);

            if (!discount) return res.status(404).json({ message: "Discount không tồn tại" });

            return res.status(200).json({ success: true, message: "Xoá Discount thành công", data: { id } });
        } catch (error) {
            console.error("Lỗi ở deleteDiscount:", error);
            return res.status(500).json({ message: "Lỗi khi xoá Discount", error });
        }
    }
};

export default DiscountController;
