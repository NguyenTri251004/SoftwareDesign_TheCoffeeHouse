import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";


//router.get("/profile", verifyToken, userController.getProfile);
router.get("/profile", userController.getProfile);

export default router;
