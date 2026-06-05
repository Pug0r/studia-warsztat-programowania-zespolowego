import express from "express";
import { authMiddleware } from "#middlewares/middlewares.js";
import * as medicalScheduleController from "./medicalSchedule.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", medicalScheduleController.listEvents);
router.post("/", medicalScheduleController.createEvent);
router.get("/upcoming", medicalScheduleController.listUpcomingEvents);
router.get("/reminders", medicalScheduleController.listReminders);
router.post("/reminders/run", medicalScheduleController.runReminders);
router.patch("/:id", medicalScheduleController.updateEvent);
router.delete("/:id", medicalScheduleController.cancelEvent);

export default router;
