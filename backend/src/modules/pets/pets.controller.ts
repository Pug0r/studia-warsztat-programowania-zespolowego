import type { Request, Response } from "express";
import * as petsService from "./pets.service.js";
import {
  validateCreatePetPayload,
  validateCreatePetWalkPayload,
  validateOptionalDate,
  validatePetId,
  validateSize,
  validateUpdatePetWalkPayload,
  validateWalkId,
} from "./pets.validation.js";

type MulterRequest = Request & { file?: Express.Multer.File };

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const list = async (req: Request, res: Response) => {
  try {
    const size = validateSize(req.query.size);
    const pets = await petsService.list(size);
    return res.json(pets);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};

export const listWithWalkSummary = async (_req: Request, res: Response) => {
  try {
    const pets = await petsService.listWithWalkSummary();
    return res.json(pets);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return sendServerError(res, message);
  }
};

export const listWalkPriorityDogs = async (req: Request, res: Response) => {
  try {
    const walkDate = validateOptionalDate(req.query.date);
    const pets = await petsService.listWalkPriorityDogs(walkDate);
    return res.json(pets);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const listWalks = async (_req: Request, res: Response) => {
  try {
    const walks = await petsService.listWalks();
    return res.json(walks);
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

export const recordWalk = async (req: Request, res: Response) => {
  try {
    const petId = validatePetId(req.params.id);
    const pet = await petsService.getById(petId);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found." });
    }

    const payload = validateCreatePetWalkPayload(req.body);
    const walk = await petsService.recordWalk(petId, payload);

    return res.status(201).json(walk);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const updateWalk = async (req: Request, res: Response) => {
  try {
    const walkId = validateWalkId(req.params.walkId);
    const payload = validateUpdatePetWalkPayload(req.body);

    if (payload.pet_id !== undefined) {
      const pet = await petsService.getById(payload.pet_id);

      if (!pet) {
        return res.status(404).json({ error: "Pet not found." });
      }
    }

    const walk = await petsService.updateWalk(walkId, payload);

    if (!walk) {
      return res.status(404).json({ error: "Walk not found." });
    }

    return res.json(walk);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const deleteWalk = async (req: Request, res: Response) => {
  try {
    const walkId = validateWalkId(req.params.walkId);
    const walk = await petsService.getWalkById(walkId);

    if (!walk) {
      return res.status(404).json({ error: "Walk not found." });
    }

    await petsService.deleteWalk(walkId);
    return res.status(204).send();
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

export const uploadPhoto = async (req: MulterRequest, res: Response) => {
  try {
    const id = validatePetId(req.params.id);

    const pet = await petsService.getById(id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found." });
    }

    if (!req.file) {
      return sendBadRequest(res, "No file provided.");
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(req.file.mimetype)) {
      return sendBadRequest(res, "Only JPEG, PNG and WebP images are allowed.");
    }

    const imageUrl = await petsService.uploadPhoto(
      id,
      req.file.buffer,
      req.file.mimetype,
    );

    return res.json({ image_url: imageUrl });
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }
    return sendServerError(res);
  }
};
