import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

router.get("/profile", authMiddleware, userController.getProfile);

export default router;
