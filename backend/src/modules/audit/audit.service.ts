import type { AuditLogInsert } from "@repo/types";
import type { Request, RequestHandler } from "express";
import { supabase } from "#config/supabaseClient.js";
import type { AuditEventInput, AuditRequestContext } from "./audit.types.js";

const extractIpAddress = (req: Request): string | null => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0] ?? null;
  }

  return req.ip ?? null;
};

const getAccessToken = (req: Request): string | null => {
  const authorization = req.header("authorization");

  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();
  return token || null;
};

const buildAuditContext = (req: Request): AuditRequestContext => ({
  actorUserId: req.auditContext?.actorUserId ?? null,
  actorEmail: req.auditContext?.actorEmail ?? null,
  ipAddress: req.auditContext?.ipAddress ?? extractIpAddress(req),
  userAgent: req.auditContext?.userAgent ?? req.get("user-agent") ?? null,
  method: req.auditContext?.method ?? req.method,
  route: req.auditContext?.route ?? req.originalUrl,
});

const toEntityId = (
  entityId: string | number | null | undefined,
): string | null => {
  if (entityId === undefined || entityId === null) {
    return null;
  }

  return String(entityId);
};

export const attachAuditContext: RequestHandler = async (req, _res, next) => {
  req.auditContext = buildAuditContext(req);

  const accessToken = getAccessToken(req);

  if (!accessToken) {
    next();
    return;
  }

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (!error) {
      req.auditContext.actorUserId = data.user.id;
      req.auditContext.actorEmail = data.user.email ?? null;
    }
  } catch (error) {
    console.error("Failed to resolve audit actor.", error);
  }

  next();
};

export const getAuditRequestContext = (req: Request): AuditRequestContext =>
  buildAuditContext(req);

export const recordAuditEvent = async (
  req: Request,
  event: AuditEventInput,
): Promise<void> => {
  const context = getAuditRequestContext(req);

  const row: AuditLogInsert = {
    action: event.action,
    actor_email:
      event.actorEmail === undefined ? context.actorEmail : event.actorEmail,
    actor_user_id:
      event.actorUserId === undefined ? context.actorUserId : event.actorUserId,
    entity_id: toEntityId(event.entityId),
    entity_type: event.entityType,
    ip_address: context.ipAddress,
    metadata: event.metadata ?? {},
    method: context.method,
    new_data: event.newData ?? null,
    old_data: event.oldData ?? null,
    route: context.route,
    user_agent: context.userAgent,
  };

  const { error } = await supabase.from("audit_logs").insert(row);

  if (error) {
    throw new Error(error.message);
  }
};

export const recordAuditEventBestEffort = async (
  req: Request,
  event: AuditEventInput,
): Promise<void> => {
  try {
    await recordAuditEvent(req, event);
  } catch (error) {
    console.error("Failed to write audit log.", {
      action: event.action,
      entityType: event.entityType,
      error,
    });
  }
};
