import type { FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

import { baseApi } from "@/store/api/baseApi";
import type {
  AdminOverview,
  AdminOverviewParams,
  ExportDataset,
  ExportResult,
} from "@/types/adminOverview";
import type {
  AdminEnrollmentRow,
  AdminPaymentDetail,
  AdminPaymentRow,
  ListAdminEnrollmentsParams,
  ListAdminPaymentsParams,
  Pagination,
  RevenueSummary,
  RevenueSummaryParams,
} from "@/types/adminReports";
import { API_PATHS } from "@/utils/constants";

const withQuery = (path: string, params: object) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

/** `attachment; filename="sfs-payments-2026-10-26.csv"` → the file name. */
const filenameFrom = (disposition: string | null | undefined) =>
  disposition?.match(/filename="?([^";]+)"?/)?.[1] ?? null;

/** Read-only admin reports: overview, enrollments, payments, revenue, exports. */
export const adminReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminOverview, AdminOverviewParams>({
      query: (params) => withQuery(API_PATHS.ADMIN_OVERVIEW, params),
      providesTags: [
        { type: "Payment", id: "ADMIN" },
        { type: "AdminParticipant", id: "LIST" },
      ],
    }),
    listAdminEnrollments: builder.query<
      { enrollments: AdminEnrollmentRow[]; pagination: Pagination },
      ListAdminEnrollmentsParams
    >({
      query: (params) => withQuery(API_PATHS.ADMIN_ENROLLMENTS, params),
      providesTags: [{ type: "Payment", id: "ADMIN" }],
    }),
    listAdminPayments: builder.query<
      { payments: AdminPaymentRow[]; pagination: Pagination },
      ListAdminPaymentsParams
    >({
      query: (params) => withQuery(API_PATHS.ADMIN_PAYMENTS, params),
      providesTags: [{ type: "Payment", id: "ADMIN" }],
    }),
    getAdminPayment: builder.query<AdminPaymentDetail, string>({
      query: (id) => API_PATHS.ADMIN_PAYMENT_BY_ID(id),
    }),
    getRevenueSummary: builder.query<RevenueSummary, RevenueSummaryParams>({
      query: (params) => withQuery(API_PATHS.ADMIN_REVENUE_SUMMARY, params),
      providesTags: [{ type: "Payment", id: "ADMIN" }],
    }),
    // A GET, but a mutation: every click must run (and be audited), never cached.
    exportAdminData: builder.mutation<
      ExportResult,
      { dataset: ExportDataset; params: object }
    >({
      query: ({ dataset, params }) => ({
        url: withQuery(API_PATHS.ADMIN_EXPORT(dataset), params),
        method: "GET",
        // CSV text on success; the JSON error envelope otherwise.
        responseHandler: (response) => (response.ok ? response.text() : response.json()),
      }),
      transformResponse: (csv: string, meta, { dataset }) => {
        // The custom base query passes fetchBaseQuery's meta through untyped.
        const headers = (meta as FetchBaseQueryMeta | undefined)?.response?.headers;
        const rowCount = headers?.get("x-export-row-count");
        return {
          csv,
          filename: filenameFrom(headers?.get("content-disposition")) ?? `sfs-${dataset}.csv`,
          rowCount: rowCount != null && rowCount !== "" ? Number(rowCount) : null,
        };
      },
      invalidatesTags: [{ type: "AuditLog", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useListAdminEnrollmentsQuery,
  useListAdminPaymentsQuery,
  useGetAdminPaymentQuery,
  useGetRevenueSummaryQuery,
  useExportAdminDataMutation,
} = adminReportsApi;
