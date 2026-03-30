import express from "express";
import * as petsController from "./pets.controller.js";

const router = express.Router();

router.get("/", petsController.list);
router.get("/:id", petsController.getById);
router.post("/", petsController.create);
router.delete("/:id", petsController.delete);

export default router;
