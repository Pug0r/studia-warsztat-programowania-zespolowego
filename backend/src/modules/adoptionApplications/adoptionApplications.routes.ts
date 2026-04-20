import express from "express";
import * as adoptionApplicationsController from "./adoptionApplications.controller.js";

const router = express.Router();

router.post("/", adoptionApplicationsController.create);

export default router;