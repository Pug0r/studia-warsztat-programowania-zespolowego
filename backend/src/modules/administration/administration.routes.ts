import express from "express";
import * as administrationController from "./administration.controller.js";
import { authMiddleware, adminMiddleware } from "#middlewares/middlewares.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/all-users", administrationController.getAllUsers);
router.get("/:id", administrationController.getUserData);

router.post("/add-user", administrationController.addUser);
router.post("/add-role/:id", administrationController.addRole);

router.delete("/:id", administrationController.deleteUser);

export default router;
