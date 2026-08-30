import { baseApi } from "@/store/api/baseApi";
import type { AuditLog, ListAuditLogsQuery } from "@/types/audit";
import { API_PATHS } from "@/utils/constants";

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAuditLogs: builder.query<AuditLog[], ListAuditLogsQuery | void>({
      query: (params) => ({
        url: API_PATHS.AUDIT_LOGS,
        params: params ?? undefined,
      }),
      providesTags: [{ type: "AuditLog", id: "LIST" }],
    }),
  }),
});

export const { useListAuditLogsQuery } = auditApi;
