import express from "express";
import ShopController from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/cities", ShopController.getCities);
router.get("/districts", ShopController.getDistrictsByCity);
router.get("/shops", ShopController.getShopByAddress);
router.get("/detail", ShopController.getShopById);
router.get("/nearbyshops", ShopController.getNearByShops);

export default router;