// index.ts
import express from "express";
import "dotenv/config";
import { middleware, authMiddleware } from "#middlewares/middlewares.js";
import { auditRouteRules } from "#modules/audit/audit.config.js";
import { createAuditMiddleware } from "#modules/audit/audit.service.js";
import itemRouter from "#api/initial-example/itemRoutes.js";
import adoptionApplicationsRouter from "#modules/adoptionApplications/adoptionApplications.routes.js";
import auditRouter from "#modules/audit/audit.routes.js";
import healthCardsRouter from "#modules/healthCards/healthCards.routes.js";
import medicalScheduleRouter from "#modules/medicalSchedule/medicalSchedule.routes.js";
import petsRouter from "#modules/pets/pets.routes.js";
import volunteersRouter from "#modules/volunteers/volunteers.routes.js";

const app = express();
const { PORT } = process.env;

if (!PORT) {
  throw new Error("PORT environment variable is required");
}

app.use(express.json());
app.use(createAuditMiddleware(auditRouteRules));
app.use("/api", itemRouter);
app.use(
  "/api/adoption-applications",
  authMiddleware,
  adoptionApplicationsRouter,
);
app.use("/api/audit-logs", auditRouter);
app.use("/api/pets", petsRouter);
app.use("/api/pets/:id", petsRouter);
app.use("/api/volunteers", authMiddleware, volunteersRouter);
app.use("/api/health-cards", healthCardsRouter);
app.use("/api/medical-schedule", medicalScheduleRouter);

app.get("/", middleware);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
