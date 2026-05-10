import type { Request, Response } from "express";
import * as volunteersService from "./volunteers.service.js";
import {
  validateCreateVolunteerPayload,
  validateUpdateVolunteerPayload,
  validateVolunteerId,
} from "./volunteers.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendNotFound = (res: Response, message: string) =>
  res.status(404).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const list = async (_req: Request, res: Response) => {
  try {
    const volunteers = await volunteersService.list();
    return res.json(volunteers);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = validateVolunteerId(req.params.id);
    const volunteer = await volunteersService.getById(id);

    if (!volunteer) {
      return sendNotFound(res, "Volunteer not found.");
    }

    return res.json(volunteer);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const payload = validateCreateVolunteerPayload(req.body);
    const volunteer = await volunteersService.create(payload);

    return res.status(201).json(volunteer);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = validateVolunteerId(req.params.id);
    const payload = validateUpdateVolunteerPayload(req.body);
    const volunteer = await volunteersService.update(id, payload);

    if (!volunteer) {
      return sendNotFound(res, "Volunteer not found.");
    }

    return res.json(volunteer);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const id = validateVolunteerId(req.params.id);
    const volunteer = await volunteersService.getById(id);

    if (!volunteer) {
      return sendNotFound(res, "Volunteer not found.");
    }

    await volunteersService.delete(id);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};

export { deleteById as delete };
