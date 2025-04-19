import express from "express";
import OrderController from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", OrderController.getListOrders);
router.get("/many", OrderController.getManyOrders);
router.get("/:id", OrderController.getOneOrder);

router.post("/", OrderController.createOrder);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

export default router;