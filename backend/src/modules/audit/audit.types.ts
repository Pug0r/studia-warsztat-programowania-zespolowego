import type { Json } from "@repo/types";

export const authAuditActions = [
  "auth.sign_in",
  "auth.sign_out",
  "auth.sign_up",
] as const;

export type AuthAuditAction = (typeof authAuditActions)[number];

export interface AuthAuditEventPayload {
  action: AuthAuditAction;
  metadata: Record<string, Json>;
}

export interface AuditRequestContext {
  actorUserId: string | null;
  actorEmail: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  method: string;
  route: string;
}

export interface AuditEventInput {
  action: string;
  entityType: string;
  entityId?: string | number | null;
  metadata?: Json;
  oldData?: Json | null;
  newData?: Json | null;
  actorUserId?: string | null;
  actorEmail?: string | null;
}
