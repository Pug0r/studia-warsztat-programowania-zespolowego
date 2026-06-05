import express from "express";
import { authMiddleware } from "#middlewares/middlewares.js";
import * as auditController from "./audit.controller.js";

const router = express.Router();

router.get("/actions", authMiddleware, auditController.listActions);
router.patch("/actions/:action", authMiddleware, auditController.updateAction);
router.post("/auth-events", auditController.createAuthEvent);

export default router;
