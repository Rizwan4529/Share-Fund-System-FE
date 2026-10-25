import { baseApi } from "@/store/api/baseApi";
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

/** Read-only admin reports: enrollments, payments, revenue totals. */
export const adminReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useListAdminEnrollmentsQuery,
  useListAdminPaymentsQuery,
  useGetAdminPaymentQuery,
  useGetRevenueSummaryQuery,
} = adminReportsApi;
