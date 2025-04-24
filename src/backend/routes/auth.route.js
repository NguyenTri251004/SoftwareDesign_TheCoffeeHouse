import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  logout,
} from "../controllers/auth.controller.js"; // Make sure the file extension is .js

const router = Router();

// Đăng ký
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

// Xác thực email
router.get("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);

router.post("/reset-password", resetPassword);
router.post("/logout", logout);

// Lấy thông tin user (yêu cầu authentication)
// router.get("/profile", authMiddleware, getUserProfile);

export default router;
