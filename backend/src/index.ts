// index.ts
import express from "express";
import "dotenv/config";
import { middleware } from "#middlewares/middlewares.js";
import { authMiddleware } from "#middlewares/middlewares.js";
import itemRouter from "#api/initial-example/itemRoutes.js";
import adoptionApplicationsRouter from "#modules/adoptionApplications/adoptionApplications.routes.js";
import healthCardsRouter from "#modules/healthCards/healthCards.routes.js";
import petsRouter from "#modules/pets/pets.routes.js";
import volunteersRouter from "#modules/volunteers/volunteers.routes.js";
import adminRoute from "#modules/administration/administration.routes.js";

const app = express();
const { PORT } = process.env;

if (!PORT) {
  throw new Error("PORT environment variable is required");
}

app.use(express.json());
app.use("/api", itemRouter);
app.use(
  "/api/adoption-applications",
  authMiddleware,
  adoptionApplicationsRouter,
);
app.use("/api/pets", petsRouter);
app.use("/api/health-cards", healthCardsRouter);
app.use("/api/volunteers", authMiddleware, volunteersRouter);
app.use("/api/administration", adminRoute);

app.get("/", middleware);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
