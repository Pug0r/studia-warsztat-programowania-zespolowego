import express from "express";
import multer from "multer";
import { authMiddleware } from "#middlewares/middlewares.js";

import * as petsController from "./pets.controller.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/walk-summary", petsController.listWithWalkSummary);
router.get("/walk-priority", petsController.listWalkPriorityDogs);
router.get("/walks", petsController.listWalks);
router.get("/my-walks", authMiddleware, petsController.listUpcomingWalks);
router.get("/", petsController.list);
router.delete("/walks/:walkId", authMiddleware, petsController.cancelWalk);

router.get("/", petsController.list);
router.post("/", authMiddleware, petsController.create);
router.post("/:id/walks", authMiddleware, petsController.recordWalk);
router.post(
  "/:id/photo",
  upload.single("photo"),
  authMiddleware,
  petsController.uploadPhoto,
);
router.get("/:id", petsController.getById);
router.delete("/:id", authMiddleware, petsController.delete);

export default router;
