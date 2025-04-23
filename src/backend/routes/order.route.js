import express from "express";
import OrderController from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", OrderController.getListOrders);
router.get("/user", verifyToken, OrderController.getUserOrders); // Endpoint mới để lấy đơn hàng của user đã đăng nhập
router.get("/many", OrderController.getManyOrders);
router.get("/:id", OrderController.getOneOrder);

router.post("/", OrderController.createOrder);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

export default router;