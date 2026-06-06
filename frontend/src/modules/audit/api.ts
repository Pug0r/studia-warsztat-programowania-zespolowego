import api from "@/api/api";

export type AuthAuditAction = "auth.sign_in" | "auth.sign_out" | "auth.sign_up";

export type AuditActionSetting = {
  action: string;
  enabled: boolean;
};

export async function logAuthAuditEvent(
  action: AuthAuditAction,
  metadata: Record<string, unknown> = {},
) {
  await api.post("/audit-logs/auth-events", {
    action,
    metadata,
  });
}

export function logAuthAuditEventBestEffort(
  action: AuthAuditAction,
  metadata: Record<string, unknown> = {},
) {
  logAuthAuditEvent(action, metadata).catch((error) => {
    console.error("Failed to log auth audit event.", error);
  });
}

export async function listAuditActionSettings() {
  const { data } = await api.get<AuditActionSetting[]>("/audit-logs/actions");
  return data;
}

export async function updateAuditActionSetting(
  action: string,
  enabled: boolean,
) {
  const { data } = await api.patch<AuditActionSetting>(
    `/audit-logs/actions/${encodeURIComponent(action)}`,
    { enabled },
  );

  return data;
}
