import express from "express";
import ShopController from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/cities", ShopController.getCities);
router.get("/districts", ShopController.getDistrictsByCity);
router.get("/shops", ShopController.getShopByAddress);
router.get("/detail", ShopController.getShopById);
router.get("/nearbyshops", ShopController.getNearByShops);

<<<<<<< HEAD
router.get("/cities", ShopController.getCities);
router.get("/districts", ShopController.getDistrictsByCity);
router.get("/shops", ShopController.getShopByAddress);
router.get("/detail", ShopController.getShopById);
router.get("/nearbyshops", ShopController.getNearByShops);
=======
router.get("/shops/address", ShopController.getAddress);
>>>>>>> a82b20ccb5eaa8d185c9d3e7a0fbdb2e5c051d94

router.post("/:id/products", ShopController.addProductToShop);
router.post("/:id/toppings", ShopController.addToppingToShop);

router.get("/", ShopController.getListShops);
router.post("/many", ShopController.getManyShops);
router.post("/", ShopController.createShop);
router.put("/:id", ShopController.updateShop);
router.delete("/:id", ShopController.deleteShop);
router.get("/:id", ShopController.getOneShop);

export default router;