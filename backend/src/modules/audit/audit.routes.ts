import express from "express";
import * as auditController from "./audit.controller.js";

const router = express.Router();

router.post("/auth-events", auditController.createAuthEvent);

export default router;
