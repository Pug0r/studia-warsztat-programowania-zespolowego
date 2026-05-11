// index.ts
import express from "express";
import "dotenv/config";
import { middleware } from "#middlewares/middlewares.js";
import itemRouter from "#api/initial-example/itemRoutes.js";
import adoptionApplicationsRouter from "#modules/adoptionApplications/adoptionApplications.routes.js";
import petsRouter from "#modules/pets/pets.routes.js";
import volunteersRouter from "#modules/volunteers/volunteers.routes.js";

const app = express();
const { PORT } = process.env;

if (!PORT) {
  throw new Error("PORT environment variable is required");
}

app.use(express.json());
app.use("/api", itemRouter);
app.use("/api/adoption-applications", adoptionApplicationsRouter);
app.use("/api/pets", petsRouter);
app.use("/api/volunteers", volunteersRouter);

app.get("/", middleware);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
