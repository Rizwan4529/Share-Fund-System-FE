export const AUDIT_LOG_ACTIONS = [
  "updated_setting",
  "created_setting",
  "adjusted_recommendation",
  "processed_refund",
  "deactivated_category",
  "assigned_founder_number",
  "qualified_founder",
  "created_founder_plan",
  "updated_founder_plan",
  "toggled_founder_plan_availability",
  "created_setting_category",
  "updated_setting_category",
  "deleted_setting_category",
  "created_legal_document",
  "updated_legal_document",
  "published_legal_document",
] as const;

export type AuditLogAction = (typeof AUDIT_LOG_ACTIONS)[number];

export type AuditLogActor = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

export type AuditLog = {
  _id: string;
  actorId?: AuditLogActor | string | null;
  action: string;
  targetType: string;
  targetId?: string;
  beforeValue?: unknown;
  afterValue?: unknown;
  createdAt?: string;
};

export type ListAuditLogsQuery = {
  actorId?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  from?: string;
  to?: string;
  limit?: number;
};
