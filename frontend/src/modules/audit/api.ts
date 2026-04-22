import api from "@/api/api";

export type AuthAuditAction = "auth.sign_in" | "auth.sign_out" | "auth.sign_up";

export async function logAuthAuditEvent(
  action: AuthAuditAction,
  metadata: Record<string, unknown> = {},
) {
  await api.post("/audit-logs/auth-events", {
    action,
    metadata,
  });
}
