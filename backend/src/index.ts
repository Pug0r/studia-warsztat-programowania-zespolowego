// index.ts
import express from "express";
import "dotenv/config";
import { middleware } from "#middlewares/middlewares.js";
import itemRouter from "#api/initial-example/itemRoutes.js";
import petsRouter from "#modules/pets/pets.routes.js";

const app = express();
const port = process.env.PORT ?? "5000";

app.use(express.json());
app.use("/api", itemRouter);
app.use("/api/pets", petsRouter);

app.get("/", middleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
