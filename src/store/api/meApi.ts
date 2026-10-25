import { baseApi } from "@/store/api/baseApi";
import type { ParticipantStatus } from "@/types/participantStatus";
import { API_PATHS } from "@/utils/constants";

/** Owner-only views of the logged-in participant. */
export const meApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyStatus: builder.query<ParticipantStatus, void>({
      query: () => API_PATHS.ME_STATUS,
      // Refreshes whenever payments, selections or the profile change.
      providesTags: [
        { type: "Payment", id: "ME" },
        { type: "SuccessCenterSelection", id: "ME" },
        { type: "SuccessProfile", id: "ME" },
      ],
    }),
  }),
});

export const { useGetMyStatusQuery } = meApi;
