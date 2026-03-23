// index.ts
import express from "express";
import { middleware } from "#middlewares/middlewares.js";
import itemRouter from "#api/initial-example/itemRoutes.js";

const app = express();
const port = process.env.PORT ?? "9001";

app.use("/api", itemRouter);

app.get("/", middleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});