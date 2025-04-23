import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

router.get("/profile", verifyToken, userController.getProfile);
router.put("/customer/:id/profile", verifyToken, userController.updateCustomerProfile);
router.post("/redeem-points", verifyToken, userController.redeemPoints);

export default router;