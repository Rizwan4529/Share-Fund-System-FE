/** Mirrors the backend ENUMS.AUDIT_LOG_ACTION (used by the Audit log filter). */
export const AUDIT_LOG_ACTIONS = [
  "updated_setting",
  "created_setting",
  "adjusted_recommendation",
  "approved_recommendation",
  "reset_recommendation",
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
  "created_success_center_category",
  "updated_success_center_category",
  "deleted_success_center_category",
  "created_success_center_program",
  "updated_success_center_program",
  "deleted_success_center_program",
  "created_legal_document",
  "updated_legal_document",
  "published_legal_document",
  "created_waitlist_entry",
  "updated_waitlist_entry",
  "deleted_waitlist_entry",
  "created_waitlist_campaign_category",
  "updated_waitlist_campaign_category",
  "deleted_waitlist_campaign_category",
  "completed_success_profile",
  "completed_payment",
  "updated_participant_status",
  "updated_participant_access",
  "failed_payment",
  "exported_data",
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
