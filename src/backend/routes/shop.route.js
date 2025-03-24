import express from "express";
import ShopController from "../controllers/shop.controller.js";
import ShopModel from "../models/shop.model.js";

const router = express.Router();

router.get("/cities", ShopController.getCities);
router.get("/districts", ShopController.getDistrictsByCity);
router.get("/shops", ShopController.getShopByAddress);
router.get("/detail", ShopController.getShopById);
router.get("/nearbyshops", ShopController.getNearByShops);

router.get("/", async (req, res) => {
    try {
        const start = req.query.start || 0;
        const end = req.query.end || 10;
        
        const total = await ShopModel.countDocuments();
        const shops = await ShopController.getAllShops(start, end);

        if (!Array.isArray(shops)) {
            throw new Error("getAllShops did not return an array");
        }

        res.set("X-Total-Count", total);
        res.json({
            data: shops,
        });
    } catch (error) {
        console.error("Error in GET /api/shop:", error);
        res.set("X-Total-Count", 0);
        res.json({
            data: [],
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const shop = await ShopController.createShop(req.body);
        res.status(201).json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const shop = await ShopController.updateShop(req.params.id, req.body);
        res.json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await ShopController.deleteShop(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const shop = await ShopController.getOneShop(req.params.id);
        res.json(shop);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default router;