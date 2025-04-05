import express from "express";
import FlashSaleController from "../controllers/flashsale.controller.js";

const router = express.Router();

router.get("/", FlashSaleController.getListFlashSales);
router.post("/shop/:shopId/many", FlashSaleController.getManyFlashSales);
router.post("/", FlashSaleController.createFlashSale);
router.put("/:id", FlashSaleController.updateFlashSale);
router.delete("/:id", FlashSaleController.deleteFlashSale);
router.get("/:id", FlashSaleController.getOneFlashSale);

export default router;
