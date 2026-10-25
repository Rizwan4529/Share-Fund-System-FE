import { baseApi } from "@/store/api/baseApi";
import type { ParticipantDashboard } from "@/types/dashboard";
import type { ParticipantStatus } from "@/types/participantStatus";
import { API_PATHS } from "@/utils/constants";

// Refreshes whenever payments, selections or the profile change.
const ME_TAGS = [
  { type: "Payment" as const, id: "ME" },
  { type: "SuccessCenterSelection" as const, id: "ME" },
  { type: "SuccessProfile" as const, id: "ME" },
];

/** Owner-only views of the logged-in participant. */
export const meApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyStatus: builder.query<ParticipantStatus, void>({
      query: () => API_PATHS.ME_STATUS,
      providesTags: ME_TAGS,
    }),
    getMyDashboard: builder.query<ParticipantDashboard, void>({
      query: () => API_PATHS.ME_DASHBOARD,
      providesTags: ME_TAGS,
    }),
  }),
});

export const { useGetMyStatusQuery, useGetMyDashboardQuery } = meApi;
