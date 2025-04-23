import express from "express";
import CartController from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:userId", CartController.getCart);
router.post("/add", CartController.addToCart);
router.post("/remove", CartController.removeFromCart);

export default router;
