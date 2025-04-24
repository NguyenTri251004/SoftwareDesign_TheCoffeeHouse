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
            let order;
            
            // Check if the ID is a valid MongoDB ObjectId
            if (mongoose.Types.ObjectId.isValid(id)) {
                order = await OrderModel.findById(id)
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
            } else {
                // If not a valid ObjectId, try to find by another field (like a custom id field)
                order = await OrderModel.findOne({ id })
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
            }
                
            if (!order)
                return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });

            return res.status(200).json({ success: true, data: order });
        } catch (error) {
            console.error("Lỗi getOneOrder:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy đơn hàng", error: error.message });
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
            const updateData = { ...req.body };
            
            // Nếu trạng thái đơn hàng thay đổi, cập nhật thời gian cho trạng thái mới
            if (updateData.status) {
                const currentOrder = await OrderModel.findById(id);
                if (!currentOrder) {
                    return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại" });
                }
                
                // Chỉ cập nhật thời gian nếu trạng thái thực sự thay đổi
                if (currentOrder.status !== updateData.status) {
                    // Sử dụng status.toLowerCase() để đảm bảo key trong Map là chữ thường
                    const statusKey = updateData.status.toLowerCase();
                    
                    // Cập nhật statusTimes
                    if (!updateData.statusTimes) {
                        updateData.statusTimes = {};
                    }
                    
                    // Thêm mốc thời gian cho trạng thái mới
                    updateData.statusTimes[statusKey] = new Date();
                }
            }

            const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, {
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
                    path: 'shopId',
                    model: 'Shop',
                    select: 'name address phone image'
                })
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
    },

    getOrdersByStatus: async (req, res) => {
        try {
            const { status } = req.query;
            const userId = req.userId;
            
            if (!userId) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại" 
                });
            }

            // Xây dựng query dựa trên status được cung cấp
            const query = { userId };
            
            // Nếu có status và status hợp lệ, thêm vào query
            if (status && ['Pending', 'Confirmed', 'Preparing', 'Delivering', 'Delivered', 'Cancelled'].includes(status)) {
                query.status = status;
            } else if (status === 'All') {
                // Không thêm bất kỳ bộ lọc status nào nếu là 'All'
            } else if (status) {
                // Nếu status được cung cấp nhưng không hợp lệ
                return res.status(400).json({ 
                    success: false, 
                    message: "Trạng thái đơn hàng không hợp lệ. Trạng thái hợp lệ: Pending, Confirmed, Preparing, Delivering, Delivered, Cancelled" 
                });
            }
            
            // Tìm tất cả đơn hàng phù hợp với query và populate thông tin chi tiết
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
                })
                .populate({
                    path: 'shopId',
                    model: 'Shop',
                    select: 'name' // Chọn các trường cần thiết từ shop
                })
                .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
            
            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        } catch (error) {
            console.error("Lỗi getOrdersByStatus:", error);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi khi lọc danh sách đơn hàng theo trạng thái", 
                error: error.message 
            });
        }
    },

    cancelOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            
            // Kiểm tra xem đơn hàng có tồn tại không
            const order = await OrderModel.findById(id);
            if (!order) {
                return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại" });
            }
            
            // Kiểm tra xem người dùng có quyền hủy đơn không
            // Nếu là người dùng thường, chỉ được hủy đơn của mình
            if (req.userRole === 'user' && order.userId.toString() !== req.userId) {
                return res.status(403).json({ success: false, message: "Bạn không có quyền hủy đơn hàng này" });
            }
            
            // Kiểm tra xem đơn hàng có thể hủy không (không thể hủy khi đang giao hoặc đã giao)
            if (['Delivering', 'Delivered'].includes(order.status)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Không thể hủy đơn hàng khi đã trong trạng thái giao hàng hoặc đã giao hàng" 
                });
            }
            
            // Cập nhật trạng thái và lý do hủy
            const updateData = {
                status: 'Cancelled',
                cancelReason: reason || 'Không có lý do',
            };
            
            // Cập nhật thời gian hủy đơn
            updateData.statusTimes = order.statusTimes || {};
            updateData.statusTimes.cancelled = new Date();
            
            // Cập nhật đơn hàng
            const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true
            });
            
            return res.status(200).json({
                success: true,
                message: "Hủy đơn hàng thành công",
                data: updatedOrder
            });
        } catch (error) {
            console.error("Lỗi cancelOrder:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi hủy đơn hàng", error: error.message });
        }
    },
};

export default OrderController;