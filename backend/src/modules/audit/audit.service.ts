import type { AuditActionSettingRow, AuditLogInsert } from "@repo/types";
import type { Request, RequestHandler } from "express";
import { supabase } from "#config/supabaseClient.js";
import {
  availableAuditActions,
  type AuditActionSettingView,
  type AuditEventInput,
  type AuditRouteRule,
} from "./audit.types.js";

interface RouteMatch {
  params: Record<string, string>;
  rule: AuditRouteRule;
}

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

const toEntityId = (
  entityId: string | number | null | undefined,
): string | null => {
  if (entityId === undefined || entityId === null) {
    return null;
  }

  return String(entityId);
};

const isMissingSettingsTableError = (message: string) =>
  message.includes("audit_action_settings") || message.includes("schema cache");

const isAuditActionEnabled = async (action: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("audit_action_settings")
    .select("enabled")
    .eq("action", action)
    .maybeSingle();

  if (error) {
    if (!isMissingSettingsTableError(error.message)) {
      console.error("Failed to read audit action setting.", {
        action,
        error: error.message,
      });
    }

    return true;
  }

  return data?.enabled ?? true;
};

const mapSettings = (
  rows: Pick<AuditActionSettingRow, "action" | "enabled">[] | null,
): AuditActionSettingView[] => {
  const enabledByAction = new Map(
    rows?.map((row) => [row.action, row.enabled]) ?? [],
  );

  return availableAuditActions.map((action) => ({
    action,
    enabled: enabledByAction.get(action) ?? true,
  }));
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const compileRule = (rule: AuditRouteRule) => {
  const paramNames: string[] = [];
  const pattern = rule.path
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        paramNames.push(segment.slice(1));
        return "([^/]+)";
      }

      return escapeRegex(segment);
    })
    .join("/");

  return {
    paramNames,
    regex: new RegExp(`^${pattern}/?$`),
    rule,
  };
};

const getRequestPath = (req: Request) => req.originalUrl.split("?")[0] ?? "";

const findRouteMatch = (
  req: Request,
  compiledRules: ReturnType<typeof compileRule>[],
): RouteMatch | null => {
  const path = getRequestPath(req);

  for (const compiled of compiledRules) {
    if (compiled.rule.method !== req.method) {
      continue;
    }

    const match = compiled.regex.exec(path);
    if (!match) {
      continue;
    }

    const params = Object.fromEntries(
      compiled.paramNames.map((name, index) => [
        name,
        decodeURIComponent(match[index + 1] ?? ""),
      ]),
    );

    return {
      params,
      rule: compiled.rule,
    };
  }

  return null;
};

const resolveActor = async (req: Request) => {
  if (req.user) {
    return {
      actorEmail: req.user.email ?? null,
      actorUserId: req.user.id,
    };
  }

  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return {
      actorEmail: null,
      actorUserId: null,
    };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error) {
    return {
      actorEmail: null,
      actorUserId: null,
    };
  }

  return {
    actorEmail: data.user.email ?? null,
    actorUserId: data.user.id,
  };
};

export const recordAuditEvent = async (
  req: Request,
  event: AuditEventInput,
): Promise<void> => {
  if (!event.skipActionSettingCheck) {
    const enabled = await isAuditActionEnabled(event.action);
    if (!enabled) {
      return;
    }
  }

  const actor = await resolveActor(req);

  const row: AuditLogInsert = {
    action: event.action,
    actor_email:
      event.actorEmail === undefined ? actor.actorEmail : event.actorEmail,
    actor_user_id:
      event.actorUserId === undefined ? actor.actorUserId : event.actorUserId,
    entity_id: toEntityId(event.entityId),
    entity_type: event.entityType,
    ip_address: extractIpAddress(req),
    metadata: event.metadata ?? {},
    method: req.method,
    new_data: event.newData ?? null,
    old_data: event.oldData ?? null,
    route: req.originalUrl,
    user_agent: req.get("user-agent") ?? null,
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

export const createAuditMiddleware = (
  rules: AuditRouteRule[],
): RequestHandler => {
  const compiledRules = rules.map(compileRule);

  return (req, res, next) => {
    const match = findRouteMatch(req, compiledRules);

    if (!match) {
      next();
      return;
    }

    res.on("finish", () => {
      if (res.statusCode >= 400) {
        return;
      }

      void recordAuditEventBestEffort(req, {
        action: match.rule.action,
        entityId: match.rule.entityIdParam
          ? match.params[match.rule.entityIdParam]
          : null,
        entityType: match.rule.entityType,
        metadata: {
          params: match.params,
          status_code: res.statusCode,
        },
        skipActionSettingCheck: match.rule.skipActionSettingCheck,
      });
    });

    next();
  };
};

export const listAuditActionSettings = async (): Promise<
  AuditActionSettingView[]
> => {
  const { data, error } = await supabase
    .from("audit_action_settings")
    .select("action, enabled");

  if (error) {
    if (isMissingSettingsTableError(error.message)) {
      return mapSettings(null);
    }

    throw new Error(error.message);
  }

  return mapSettings(data);
};

export const updateAuditActionSetting = async (
  action: string,
  enabled: boolean,
): Promise<AuditActionSettingView> => {
  const payload = {
    action,
    enabled,
  };

  const { data, error } = await supabase
    .from("audit_action_settings")
    .upsert(payload)
    .select("action, enabled")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    action: data.action,
    enabled: data.enabled,
  };
};
