import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/customer/:id/profile", authMiddleware, userController.updateCustomerProfile);

export default router;