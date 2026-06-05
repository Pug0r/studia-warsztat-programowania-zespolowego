import type { Request, Response } from "express";
import * as medicalScheduleService from "./medicalSchedule.service.js";
import {
  validateMedicalEventId,
  validateMedicalEventPayload,
  validateMedicalEventUpdatePayload,
} from "./medicalSchedule.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const listEvents = async (_req: Request, res: Response) => {
  try {
    const events = await medicalScheduleService.listEvents();
    return res.json(events);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};

export const listUpcomingEvents = async (_req: Request, res: Response) => {
  try {
    const rawDays = _req.query.days;
    const days =
      typeof rawDays === "string" && rawDays.trim() ? Number(rawDays) : 14;

    if (!Number.isInteger(days) || days <= 0) {
      return sendBadRequest(res, "Query 'days' must be a positive integer.");
    }

    const events = await medicalScheduleService.listUpcomingEvents(days);
    return res.json(events);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const payload = validateMedicalEventPayload(req.body);
    const event = await medicalScheduleService.createEvent(payload, {
      email: req.user?.email,
      id: req.user?.id,
    });

    return res.status(201).json(event);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const id = validateMedicalEventId(req.params.id);
    const payload = validateMedicalEventUpdatePayload(req.body);
    const event = await medicalScheduleService.updateEvent(id, payload);

    return res.json(event);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const cancelEvent = async (req: Request, res: Response) => {
  try {
    const id = validateMedicalEventId(req.params.id);
    const event = await medicalScheduleService.cancelEvent(id);

    return res.json(event);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const listReminders = async (_req: Request, res: Response) => {
  try {
    const reminders = await medicalScheduleService.listReminders();
    return res.json(reminders);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};

export const runReminders = async (_req: Request, res: Response) => {
  try {
    const result = await medicalScheduleService.createDueReminders();
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};
