import type { Request, Response } from "express";
import * as adoptionApplicationsService from "./adoptionApplications.service.js";
import {
  validateAdoptionApplicationId,
  validateCreateAdoptionApplicationPayload,
  validateUpdateAdoptionStatusPayload,
} from "./adoptionApplications.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendNotFound = (res: Response, message: string) =>
  res.status(404).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const get = async (_req: Request, res: Response) => {
  try {
    const applications = await adoptionApplicationsService.get();

    return res.json(applications);
  } catch (error) {
    if (error instanceof Error) {
      return sendServerError(res, error.message);
    }

    return sendServerError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const payload = validateCreateAdoptionApplicationPayload(req.body);
    const application = await adoptionApplicationsService.create(payload);

    return res.status(201).json(application);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const id = validateAdoptionApplicationId(req.params.id);
    const payload = validateUpdateAdoptionStatusPayload(req.body);
    const application = await adoptionApplicationsService.updateStatus(
      id,
      payload.status,
    );

    if (!application) {
      return sendNotFound(res, "Adoption application not found.");
    }

    return res.json(application);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};
