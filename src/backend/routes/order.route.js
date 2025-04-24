import express from "express";
import OrderController from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Thêm endpoint tìm đơn hàng theo số điện thoại - không yêu cầu đăng nhập
router.get("/track-by-phone", OrderController.findOrdersByPhone);

router.get("/", OrderController.getListOrders);
router.get("/user", verifyToken, OrderController.getUserOrders); // Endpoint để lấy đơn hàng của user đã đăng nhập
router.get("/user/status", verifyToken, OrderController.getOrdersByStatus); // Endpoint mới để lọc đơn hàng theo trạng thái
router.get("/many", OrderController.getManyOrders);
router.get("/:id", OrderController.getOneOrder);

router.post("/", OrderController.createOrder);
router.put("/:id", OrderController.updateOrder);
router.put("/:id/cancel", verifyToken, OrderController.cancelOrder); // Endpoint mới để hủy đơn hàng
router.delete("/:id", OrderController.deleteOrder);

export default router;