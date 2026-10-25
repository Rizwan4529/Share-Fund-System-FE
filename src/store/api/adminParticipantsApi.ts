import { baseApi } from "@/store/api/baseApi";
import type {
  AdminSettableAccountStatus,
  ParticipantAccessSummary,
  UpdateParticipantAccessRequest,
  AdminParticipantDetail,
  AdminParticipantsPage,
  ListAdminParticipantsParams,
} from "@/types/adminParticipants";
import { API_PATHS } from "@/utils/constants";

function participantsListUrl(params: ListAdminParticipantsParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return `${API_PATHS.ADMIN_PARTICIPANTS}?${search.toString()}`;
}

export const adminParticipantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminParticipants: builder.query<
      AdminParticipantsPage,
      ListAdminParticipantsParams
    >({
      query: participantsListUrl,
      providesTags: [{ type: "AdminParticipant", id: "LIST" }],
    }),
    getAdminParticipant: builder.query<AdminParticipantDetail, string>({
      query: (userId) => API_PATHS.ADMIN_PARTICIPANT_BY_ID(userId),
      providesTags: (_result, _error, userId) => [
        { type: "AdminParticipant", id: userId },
      ],
    }),
    updateParticipantStatus: builder.mutation<
      ParticipantAccessSummary,
      { userId: string; status: AdminSettableAccountStatus }
    >({
      query: ({ userId, status }) => ({
        url: API_PATHS.ADMIN_PARTICIPANT_STATUS(userId),
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "AdminParticipant", id: "LIST" },
        { type: "AdminParticipant", id: userId },
      ],
    }),
    updateParticipantAccess: builder.mutation<
      ParticipantAccessSummary,
      { userId: string } & UpdateParticipantAccessRequest
    >({
      query: ({ userId, ...body }) => ({
        url: API_PATHS.ADMIN_PARTICIPANT_ACCESS(userId),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "AdminParticipant", id: "LIST" },
        { type: "AdminParticipant", id: userId },
      ],
    }),
  }),
});

export const {
  useListAdminParticipantsQuery,
  useGetAdminParticipantQuery,
  useUpdateParticipantStatusMutation,
  useUpdateParticipantAccessMutation,
} = adminParticipantsApi;
