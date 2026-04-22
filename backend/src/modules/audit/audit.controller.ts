import type { Json } from "@repo/types";
import type { Request, Response } from "express";
import { recordAuditEvent } from "./audit.service.js";
import { validateAuthAuditEventPayload } from "./audit.validation.js";

const sendBadRequest = (res: Response, message: string) =>
  res.status(400).json({ error: message });

const sendServerError = (res: Response, message = "Internal server error.") =>
  res.status(500).json({ error: message });

const inferActorEmail = (
  req: Request,
  metadata: Record<string, Json>,
): string | null => {
  if (req.auditContext?.actorEmail) {
    return req.auditContext.actorEmail;
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
        entityId: req.auditContext?.actorUserId ?? null,
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
