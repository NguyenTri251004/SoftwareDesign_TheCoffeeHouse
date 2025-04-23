import express from "express";
import PaymentController from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route tạo thanh toán MoMo
router.post("/create-momo-payment", verifyToken, PaymentController.createMomoPayment);

// Route callback từ MoMo (IPN)
router.post("/momo-ipn", PaymentController.momoIpnCallback);

// Route xử lý kết quả thanh toán demo
router.post("/process-demo-payment", verifyToken, PaymentController.processDemoPayment);

// Route kiểm tra trạng thái thanh toán
router.get("/check-payment-status/:paymentId", verifyToken, PaymentController.checkPaymentStatus);

export default router;