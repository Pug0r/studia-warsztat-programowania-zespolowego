import type { Json } from "@repo/types";

export const authAuditActions = [
  "auth.sign_in",
  "auth.sign_out",
  "auth.sign_up",
] as const;

export type AuthAuditAction = (typeof authAuditActions)[number];

export const availableAuditActions = [
  ...authAuditActions,
  "adoption_application.create",
  "adoption_application.status_update",
  "pet.create",
  "pet.delete",
  "pet.photo_upload",
  "pet.walk_record",
  "pet.walk_update",
  "pet.walk_cancel",
  "medical_event.create",
  "medical_event.update",
  "medical_event.cancel",
  "medical_reminder.run",
  "audit_action_setting.update",
  "volunteer.create",
  "volunteer.update",
  "volunteer.delete",
] as const;

export interface AuthAuditEventPayload {
  action: AuthAuditAction;
  metadata: Record<string, Json>;
}

export interface AuditActionSettingPayload {
  enabled: boolean;
}

export interface AuditActionSettingView {
  action: string;
  enabled: boolean;
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
  skipActionSettingCheck?: boolean;
}

export interface AuditRouteRule {
  action: string;
  entityIdParam?: string;
  entityType: string;
  method: "DELETE" | "PATCH" | "POST" | "PUT";
  path: string;
  skipActionSettingCheck?: boolean;
}
