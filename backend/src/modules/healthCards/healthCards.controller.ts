import type { Request, Response } from "express";
import * as healthCardsService from "./healthCards.service.js";
import { validatePetId } from "./healthCards.validation.js";

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
