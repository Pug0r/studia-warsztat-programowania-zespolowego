import type { Request, Response } from "express";
import * as healthCardsService from "./healthCards.service.js";
import {
  validateCreateEntryPayload,
  validateEntryId,
  validatePetId,
  validateUpdateEntryPayload,
} from "./healthCards.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const listByPet = async (req: Request, res: Response) => {
  try {
    const petId = validatePetId(req.params.petId);
    const entries = await healthCardsService.listByPet(petId);
    return res.json(entries);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const vetId = req.user?.id;
    if (!vetId) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const petId = validatePetId(req.params.petId);
    const payload = validateCreateEntryPayload(req.body);

    const entry = await healthCardsService.create(petId, payload, {
      id: vetId,
      email: req.user?.email ?? null,
    });

    return res.status(201).json(entry);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const entryId = validateEntryId(req.params.entryId);
    const payload = validateUpdateEntryPayload(req.body);

    const existing = await healthCardsService.getById(entryId);
    if (!existing) {
      return res.status(404).json({ error: "Entry not found." });
    }

    const entry = await healthCardsService.update(entryId, payload);
    return res.json(entry);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const entryId = validateEntryId(req.params.entryId);

    const existing = await healthCardsService.getById(entryId);
    if (!existing) {
      return res.status(404).json({ error: "Entry not found." });
    }

    await healthCardsService.remove(entryId);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};
