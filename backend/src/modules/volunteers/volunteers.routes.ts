import express from "express";
import * as volunteersController from "./volunteers.controller.js";

const router = express.Router();

router.get("/", volunteersController.list);
router.get("/:id", volunteersController.getById);
router.post("/", volunteersController.create);
router.patch("/:id", volunteersController.update);
router.delete("/:id", volunteersController.delete);

export default router;
