import express from "express";
import CategoryController from "../controllers/category.controller.js";

const router = express.Router();



router.get("/", CategoryController.getListCategories);
router.post("/many", CategoryController.getManyCategories);
router.get("/parent", CategoryController.getListParentCategories);
router.get("/children", CategoryController.getListChildCategories);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);
router.get("/:id", CategoryController.getOneCategory);

export default router;