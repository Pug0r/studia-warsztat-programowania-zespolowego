import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";

export type AuditActionSettingRow = Tables<"audit_action_settings">;

export type AuditActionSettingInsert = TablesInsert<"audit_action_settings">;

export type AuditActionSettingUpdate = TablesUpdate<"audit_action_settings">;
