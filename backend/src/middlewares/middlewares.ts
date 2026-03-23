// middlewares.ts
import { RequestHandler } from "express";

export const middleware: RequestHandler = (req, res, next) => {
  console.log("Middleware works!");
  next();
};