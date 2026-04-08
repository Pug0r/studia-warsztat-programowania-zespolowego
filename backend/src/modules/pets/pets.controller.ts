import type { Request, Response } from "express";
import * as petsService from "./pets.service.js";
import { validateCreatePetPayload, validatePetId } from "./pets.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const list = async (_req: Request, res: Response) => {
  try {
    const pets = await petsService.list();
    return res.json(pets);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = validatePetId(req.params.id);
    const pet = await petsService.getById(id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found." });
    }

    return res.json(pet);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const payload = validateCreatePetPayload(req.body);
    const pet = await petsService.create(payload);

    return res.status(201).json(pet);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const id = validatePetId(req.params.id);
    const pet = await petsService.getById(id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found." });
    }

    await petsService.delete(id);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export { deleteById as delete };
