import express from "express";
import * as healthCardsController from "./healthCards.controller.js";
import { authMiddleware } from "#middlewares/middlewares.js";

const router = express.Router();

router.get(
  "/pets/:petId/entries",
  authMiddleware,
  healthCardsController.listByPet,
);

export default router;
