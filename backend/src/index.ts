// index.ts
import "#config/loadEnv.js";
import express from "express";
import { middleware } from "#middlewares/middlewares.js";
import { attachAuditContext } from "#modules/audit/audit.service.js";
import itemRouter from "#api/initial-example/itemRoutes.js";
import adoptionApplicationsRouter from "#modules/adoptionApplications/adoptionApplications.routes.js";
import auditRouter from "#modules/audit/audit.routes.js";
import petsRouter from "#modules/pets/pets.routes.js";

const app = express();
const port = process.env.PORT ?? "5000";

app.use(express.json());
app.use(attachAuditContext);
app.use("/api", itemRouter);
app.use("/api/adoption-applications", adoptionApplicationsRouter);
app.use("/api/audit-logs", auditRouter);
app.use("/api/pets", petsRouter);

app.get("/", middleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
