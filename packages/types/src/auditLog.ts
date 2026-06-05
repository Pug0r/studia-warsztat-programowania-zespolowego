import type { Tables, TablesInsert, TablesUpdate } from "./database.types.js";

export type AuditLogRow = Tables<"audit_logs">;

export type AuditLogInsert = TablesInsert<"audit_logs">;

export type AuditLogUpdate = TablesUpdate<"audit_logs">;
