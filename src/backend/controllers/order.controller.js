import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import ToppingModel from "../models/topping.model.js";
import mongoose from "mongoose";

const OrderController = {
    getListOrders: async (req, res) => {
        try {
            const { start = 0, end = 10, shopId } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;

            const query = {};
            if (shopId) query.shopId = shopId;

            const [orders, total] = await Promise.all([
                OrderModel.find(query)
                    .populate({
                        path: 'products.productId',
                        model: 'Drink',
                        select: 'name description category image price'
                    })
                    .populate({
                        path: 'products.topping.toppingId',
                        model: 'Topping',
                        select: 'name price'
                    })
                    .skip(skip)
                    .limit(limit),
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

            const orders = await OrderModel.find(query)
                .populate({
                    path: 'products.productId',
                    model: 'Drink',
                    select: 'name description category image price'
                })
                .populate({
                    path: 'products.topping.toppingId',
                    model: 'Topping',
                    select: 'name price'
                });
                
            return res.status(200).json({ success: true, data: orders });
        } catch (error) {
            console.error("Lỗi getManyOrders:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy nhiều đơn hàng", error });
        }
    },

    getOneOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await OrderModel.findById(id)
                .populate({
                    path: 'products.productId',
                    model: 'Drink',
                    select: 'name description category image price'
                })
                .populate({
                    path: 'products.topping.toppingId',
                    model: 'Topping',
                    select: 'name price'
                });
                
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
            // Kiểm tra thông tin đầu vào
            const { userId, userName, shopId, deliveryAddress, phone, products } = req.body;
            
            if (!userId || !userName || !shopId || !deliveryAddress || !phone) {
                return res.status(400).json({
                    success: false,
                    message: "Thiếu thông tin bắt buộc cho đơn hàng",
                    error: "Vui lòng cung cấp đầy đủ: userId, userName, shopId, deliveryAddress, phone"
                });
            }

            if (!products || !Array.isArray(products) || products.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Giỏ hàng trống hoặc không hợp lệ",
                    error: "Vui lòng thêm sản phẩm vào giỏ hàng"
                });
            }

            // Kiểm tra định dạng ObjectId
            try {
                new mongoose.Types.ObjectId(userId);
                new mongoose.Types.ObjectId(shopId);
                
                for (const product of products) {
                    if (product.productId) {
                        new mongoose.Types.ObjectId(product.productId);
                    }
                    
                    if (product.topping && Array.isArray(product.topping)) {
                        for (const topping of product.topping) {
                            if (topping.toppingId) {
                                new mongoose.Types.ObjectId(topping.toppingId);
                            }
                        }
                    }
                }
            } catch (idError) {
                return res.status(400).json({
                    success: false,
                    message: "ID không hợp lệ trong yêu cầu",
                    error: idError.message
                });
            }

            // Tạo đơn hàng mới
            const newOrder = new OrderModel(req.body);
            
            // Lưu đơn hàng vào database
            await newOrder.save();
            
            return res.status(201).json({
                success: true,
                message: "Đặt hàng thành công!",
                data: newOrder
            });
        } catch (error) {
            console.error("Lỗi createOrder:", error);
            
            // Xử lý lỗi validation từ MongoDB/Mongoose
            if (error.name === 'ValidationError') {
                const validationErrors = Object.keys(error.errors).map(field => ({
                    field,
                    message: error.errors[field].message
                }));
                
                return res.status(400).json({
                    success: false,
                    message: "Dữ liệu đơn hàng không hợp lệ",
                    error: validationErrors
                });
            }
            
            // Xử lý các lỗi khác
            return res.status(500).json({
                success: false,
                message: "Lỗi khi tạo đơn hàng",
                error: error.message || "Đã xảy ra lỗi không xác định"
            });
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
    },

    getUserOrders: async (req, res) => {
        try {
            // Lấy userId từ token đã được xác thực qua middleware
            const userId = req.userId;
            
            if (!userId) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại" 
                });
            }
            
            // Tìm tất cả đơn hàng của user và populate thông tin chi tiết sản phẩm và topping
            const orders = await OrderModel.find({ userId })
                .populate({
                    path: 'products.productId',
                    model: 'Drink', // Thay đổi từ 'Product' thành 'Drink'
                    select: 'name description category image price' // Chọn các trường cần thiết từ product
                })
                .populate({
                    path: 'products.topping.toppingId',
                    model: 'Topping',
                    select: 'name price' // Chọn các trường cần thiết từ topping
                })
                .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
            
            return res.status(200).json(orders);
        } catch (error) {
            console.error("Lỗi getUserOrders:", error);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi khi lấy danh sách đơn hàng của người dùng", 
                error: error.message 
            });
        }
    }
};

export default OrderController;