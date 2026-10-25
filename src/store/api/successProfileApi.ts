import { baseApi } from "@/store/api/baseApi";
import type {
  CreateSuccessProfileRequest,
  SuccessProfileRecord,
  UpdateSuccessProfileRequest,
} from "@/types/successProfile";
import { API_PATHS } from "@/utils/constants";

const PROFILE_TAG = { type: "SuccessProfile", id: "ME" } as const;

export const successProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** `null` until the participant saves their first step. */
    getMySuccessProfile: builder.query<SuccessProfileRecord | null, void>({
      query: () => API_PATHS.SUCCESS_PROFILE_ME,
      providesTags: [PROFILE_TAG],
    }),
    /** Creates the profile, or merges into it if one already exists. */
    createSuccessProfile: builder.mutation<
      SuccessProfileRecord,
      CreateSuccessProfileRequest
    >({
      query: (body) => ({
        url: API_PATHS.SUCCESS_PROFILE,
        method: "POST",
        body,
      }),
      invalidatesTags: [PROFILE_TAG],
    }),
    /** Partial save — only the fields sent are changed. */
    updateSuccessProfile: builder.mutation<
      SuccessProfileRecord,
      UpdateSuccessProfileRequest
    >({
      query: (body) => ({
        url: API_PATHS.SUCCESS_PROFILE_ME,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [PROFILE_TAG],
    }),
    completeSuccessProfile: builder.mutation<SuccessProfileRecord, void>({
      query: () => ({
        url: API_PATHS.SUCCESS_PROFILE_COMPLETE,
        method: "PATCH",
        body: { accuracyConfirmed: true },
      }),
      invalidatesTags: [PROFILE_TAG],
    }),
  }),
});

export const {
  useGetMySuccessProfileQuery,
  useCreateSuccessProfileMutation,
  useUpdateSuccessProfileMutation,
  useCompleteSuccessProfileMutation,
} = successProfileApi;
