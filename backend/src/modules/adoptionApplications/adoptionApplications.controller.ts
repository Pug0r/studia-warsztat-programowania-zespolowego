import type { Request, Response } from "express";
import { recordAuditEventBestEffort } from "#modules/audit/audit.service.js";
import * as adoptionApplicationsService from "./adoptionApplications.service.js";
import { validateCreateAdoptionApplicationPayload } from "./adoptionApplications.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

export const create = async (req: Request, res: Response) => {
  try {
    const payload = validateCreateAdoptionApplicationPayload(req.body);
    const application = await adoptionApplicationsService.create(payload);
    await recordAuditEventBestEffort(req, {
      action: "adoption_application.create",
      actorUserId: application.user_id,
      entityId: application.id,
      entityType: "adoption_application",
      metadata: {
        pet_id: application.pet_id,
        status: application.status,
      },
      newData: application,
    });

    return res.status(201).json(application);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};
