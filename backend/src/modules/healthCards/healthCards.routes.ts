import express from "express";
import * as healthCardsController from "./healthCards.controller.js";
import { authMiddleware } from "#middlewares/middlewares.js";

const router = express.Router();

router.get(
  "/pets/:petId/entries",
  authMiddleware,
  healthCardsController.listByPet,
);
router.post(
  "/pets/:petId/entries",
  authMiddleware,
  healthCardsController.create,
);
router.patch("/entries/:entryId", authMiddleware, healthCardsController.update);
router.delete("/entries/:entryId", authMiddleware, healthCardsController.remove);
);

export default router;
