import OrderModel from "../models/order.model.js";

const OrderController = {
    getListOrders: async (req, res) => {
        try {
            const { start = 0, end = 10, shopId } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;

            const query = {};
            if (shopId) query.shopId = shopId;

            const [orders, total] = await Promise.all([
                OrderModel.find(query).skip(skip).limit(limit),
                OrderModel.countDocuments(query)
            ]);

            res.set("X-Total-Count", total);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");

            return res.status(200).json({ success: true, data: orders });
        } catch (error) {
            console.error("Lỗi getListOrders:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách đơn hàng", error });
        }
    },

    getManyOrders: async (req, res) => {
        try {
            const { ids } = req.body;
            const { shopId } = req.query;

            const query = {
                _id: { $in: ids },
                ...(shopId && { shopId }),
            };

            const orders = await OrderModel.find(query);
            return res.status(200).json({ success: true, data: orders });
        } catch (error) {
            console.error("Lỗi getManyOrders:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy nhiều đơn hàng", error });
        }
    },

    getOneOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await OrderModel.findById(id);
            if (!order)
                return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });

            return res.status(200).json({ success: true, data: order });
        } catch (error) {
            console.error("Lỗi getOneOrder:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy đơn hàng", error });
        }
    },

    createOrder: async (req, res) => {
        try {
            const newOrder = new OrderModel(req.body);
            await newOrder.save();
            return res.status(201).json({ success: true, data: newOrder });
        } catch (error) {
            console.error("Lỗi createOrder:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi tạo đơn hàng", error });
        }
    },

    updateOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedOrder = await OrderModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            if (!updatedOrder) return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại" });

            return res.status(200).json({ success: true, data: updatedOrder });
        } catch (error) {
            console.error("Lỗi updateOrder:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi cập nhật đơn hàng", error });
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedOrder = await OrderModel.findByIdAndDelete(id);

            if (!deletedOrder) return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại" });

            return res.status(200).json({
                success: true,
                message: "Xoá đơn hàng thành công",
                data: { id }
            });
        } catch (error) {
            console.error("Lỗi deleteOrder:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi xoá đơn hàng", error });
        }
    }
};

export default OrderController;