import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";

const router = Router();

router.get("/", AdminController.getListAdmins);
router.put("/:id", AdminController.updateAdmin);
router.delete("/:id", AdminController.deleteAdmin);
router.get("/:id", AdminController.getOneAdmin);

export default router;
