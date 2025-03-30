import express from "express";
import DiscountController from "../controllers/discount.controller.js";

const router = express.Router();

router.get("/", DiscountController.getListDiscounts);
router.post("/many", DiscountController.getManyDiscounts);
router.post("/", DiscountController.createDiscount);
router.put("/:id", DiscountController.updateDiscount);
router.delete("/:id", DiscountController.deleteDiscount);
router.get("/:id", DiscountController.getOneDiscount);

export default router;
