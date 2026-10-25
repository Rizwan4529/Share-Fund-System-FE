import { baseApi } from "@/store/api/baseApi";
import type {
  AdjustRecommendationRequest,
  AdminRecommendationDetail,
  AdminRecommendationsPage,
  ListAdminRecommendationsParams,
} from "@/types/adminRecommendations";
import { API_PATHS } from "@/utils/constants";

function recommendationsListUrl(params: ListAdminRecommendationsParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return `${API_PATHS.ADMIN_RECOMMENDATIONS}?${search.toString()}`;
}

/** Review/approve/adjust/reset all return the refreshed detail. */
const invalidateRecommendation = (id: string) => [
  { type: "AdminRecommendation" as const, id: "LIST" },
  { type: "AdminRecommendation" as const, id },
  { type: "AuditLog" as const, id: "LIST" },
];

export const adminRecommendationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminRecommendations: builder.query<
      AdminRecommendationsPage,
      ListAdminRecommendationsParams
    >({
      query: recommendationsListUrl,
      providesTags: [{ type: "AdminRecommendation", id: "LIST" }],
    }),
    getAdminRecommendation: builder.query<AdminRecommendationDetail, string>({
      query: (id) => API_PATHS.ADMIN_RECOMMENDATION_BY_ID(id),
      providesTags: (_result, _error, id) => [{ type: "AdminRecommendation", id }],
    }),
    approveRecommendation: builder.mutation<AdminRecommendationDetail, string>({
      query: (id) => ({ url: API_PATHS.ADMIN_RECOMMENDATION_APPROVE(id), method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => invalidateRecommendation(id),
    }),
    adjustRecommendation: builder.mutation<
      AdminRecommendationDetail,
      { id: string } & AdjustRecommendationRequest
    >({
      query: ({ id, ...body }) => ({
        url: API_PATHS.ADMIN_RECOMMENDATION_ADJUST(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => invalidateRecommendation(id),
    }),
    resetRecommendation: builder.mutation<
      AdminRecommendationDetail,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: API_PATHS.ADMIN_RECOMMENDATION_RESET(id),
        method: "PATCH",
        body: reason ? { reason } : {},
      }),
      invalidatesTags: (_result, _error, { id }) => invalidateRecommendation(id),
    }),
  }),
});

export const {
  useListAdminRecommendationsQuery,
  useGetAdminRecommendationQuery,
  useApproveRecommendationMutation,
  useAdjustRecommendationMutation,
  useResetRecommendationMutation,
} = adminRecommendationsApi;
