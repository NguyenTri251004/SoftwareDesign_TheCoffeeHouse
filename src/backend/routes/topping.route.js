import express from "express";
import ToppingController from "../controllers/topping.controller.js";

const router = express.Router();



router.get("/", ToppingController.getListToppings);
router.post("/many", ToppingController.getManyToppings);
router.post("/", ToppingController.createTopping);
router.put("/:id", ToppingController.updateTopping);
router.delete("/:id", ToppingController.deleteTopping);
router.get("/:id", ToppingController.getOneTopping);

export default router;