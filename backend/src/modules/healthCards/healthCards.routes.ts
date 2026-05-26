import express from "express";
import * as healthCardsController from "./healthCards.controller.js";
import { middleware } from "#middlewares/middlewares.js";

const router = express.Router();

router.get("/pets/:petId/entries", middleware, healthCardsController.listByPet);

export default router;
