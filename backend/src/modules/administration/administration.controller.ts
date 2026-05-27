import type { Request, Response } from "express";
import * as administrationService from "./administration.service.js";
import {
  validateAddRolePayload,
  validateAddUserPayload,
  validateUserId,
} from "./administration.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await administrationService.getAllUsers();

    return res.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;

    return sendServerError(res, message);
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const id = validateUserId(req.params.id);

    const user = await administrationService.getUserData(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const payload = validateAddUserPayload(req.body);

    const user = await administrationService.addUser(payload);

    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const addRole = async (req: Request, res: Response) => {
  try {
    const id = validateUserId(req.params.id);
    const { role } = validateAddRolePayload(req.body);

    const updatedUser = await administrationService.addRole({
      id,
      role,
    });

    return res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = validateUserId(req.params.id);

    await administrationService.deleteUser(id);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};
