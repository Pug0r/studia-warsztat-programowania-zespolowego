import express from "express";
import * as adoptionApplicationsController from "./adoptionApplications.controller.js";

const router = express.Router();

router.get("/", adoptionApplicationsController.get);
router.post("/", adoptionApplicationsController.create);
router.patch("/:id/status", adoptionApplicationsController.updateStatus);

export default router;
