import { middleware } from "#middlewares/middlewares.js";
import { Router } from "express";
import { getWelcomeMessage } from "./itemController.js";

const router = Router();

router.get("/items", middleware, getWelcomeMessage);

export default router;
