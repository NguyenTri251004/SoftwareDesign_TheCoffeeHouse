import { Router } from "express";
import { register, login } from "../controllers/authController.js"; // Make sure the file extension is .js

const router = Router();

// Đăng ký
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

// Lấy thông tin user (yêu cầu authentication)
// router.get("/profile", authMiddleware, getUserProfile);

export default router;
