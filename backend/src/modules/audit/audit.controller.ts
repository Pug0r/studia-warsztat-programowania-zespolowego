import type { Json } from "@repo/types";
import type { Request, Response } from "express";
import {
  listAuditActionSettings,
  recordAuditEvent,
  updateAuditActionSetting,
} from "./audit.service.js";
import {
  validateAuditAction,
  validateAuditActionSettingPayload,
  validateAuthAuditEventPayload,
} from "./audit.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

const inferActorEmail = (
  req: Request,
  metadata: Record<string, Json>,
): string | null => {
  if (req.user?.email) {
    return req.user.email;
  }

  const metadataEmail = metadata.email;
  return typeof metadataEmail === "string" ? metadataEmail : null;
};

export const createAuthEvent = async (req: Request, res: Response) => {
  try {
    const payload = validateAuthAuditEventPayload(req.body);

    try {
      await recordAuditEvent(req, {
        action: payload.action,
        actorEmail: inferActorEmail(req, payload.metadata),
        entityId: req.user?.id ?? null,
        entityType: "auth",
        metadata: payload.metadata,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      return sendServerError(res, message);
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};

export const listActions = async (_req: Request, res: Response) => {
  try {
    const settings = await listAuditActionSettings();
    return res.json(settings);
  } catch (error) {
    if (error instanceof Error) {
      return sendServerError(res, error.message);
    }

    return sendServerError(res);
  }
};

export const updateAction = async (req: Request, res: Response) => {
  try {
    const action = validateAuditAction(req.params.action);
    const payload = validateAuditActionSettingPayload(req.body);
    const setting = await updateAuditActionSetting(action, payload.enabled);

    return res.json(setting);
  } catch (error) {
    if (error instanceof Error) {
      return sendBadRequest(res, error.message);
    }

    return sendServerError(res);
  }
};
