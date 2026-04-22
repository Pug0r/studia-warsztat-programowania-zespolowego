import express from "express";
import multer from "multer";
import * as petsController from "./pets.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", petsController.list);
router.get("/:id", petsController.getById);
router.post("/", petsController.create);
router.post("/:id/photo", upload.single("photo"), petsController.uploadPhoto);
router.delete("/:id", petsController.delete);

export default router;
