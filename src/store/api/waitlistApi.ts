import { baseApi } from "./baseApi";
import type {
  CreateWaitlistCampaignCategoryRequest,
  ListWaitlistCampaignCategoriesParams,
  ListWaitlistParams,
  UpdateWaitlistCampaignCategoryRequest,
  UpdateWaitlistEntryRequest,
  WaitlistCampaignCategory,
  WaitlistEntry,
} from "../../types/waitlist";
import { API_PATHS } from "../../utils/constants";

function waitlistListUrl(params?: ListWaitlistParams): string {
  if (!params?.campaignCategory && !params?.status && !params?.search) {
    return API_PATHS.WAITLIST;
  }
  const search = new URLSearchParams();
  if (params.campaignCategory) {
    search.set("campaignCategory", params.campaignCategory);
  }
  if (params.status) search.set("status", params.status);
  if (params.search?.trim()) search.set("search", params.search.trim());
  return `${API_PATHS.WAITLIST}?${search.toString()}`;
}

function campaignCategoriesListUrl(
  params?: ListWaitlistCampaignCategoriesParams,
): string {
  if (!params?.includeInactive) return API_PATHS.WAITLIST_CAMPAIGN_CATEGORIES;
  return `${API_PATHS.WAITLIST_CAMPAIGN_CATEGORIES}?includeInactive=true`;
}

export const waitlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWaitlistEntries: builder.query<
      WaitlistEntry[],
      ListWaitlistParams | void
    >({
      query: (params) => waitlistListUrl(params ?? undefined),
      providesTags: (result) =>
        result
          ? [
              ...result.map((entry) => ({
                type: "WaitlistEntry" as const,
                id: entry._id,
              })),
              { type: "WaitlistEntry", id: "LIST" },
            ]
          : [{ type: "WaitlistEntry", id: "LIST" }],
    }),
    getWaitlistEntryById: builder.query<WaitlistEntry, string>({
      query: (id) => API_PATHS.WAITLIST_BY_ID(id),
      providesTags: (_result, _error, id) => [{ type: "WaitlistEntry", id }],
    }),
    updateWaitlistEntry: builder.mutation<
      WaitlistEntry,
      { id: string } & UpdateWaitlistEntryRequest
    >({
      query: ({ id, ...body }) => ({
        url: API_PATHS.WAITLIST_BY_ID(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "WaitlistEntry", id },
        { type: "WaitlistEntry", id: "LIST" },
      ],
    }),
    deleteWaitlistEntry: builder.mutation<WaitlistEntry, string>({
      query: (id) => ({
        url: API_PATHS.WAITLIST_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "WaitlistEntry", id: "LIST" }],
    }),
    listWaitlistCampaignCategories: builder.query<
      WaitlistCampaignCategory[],
      ListWaitlistCampaignCategoriesParams | void
    >({
      query: (params) => campaignCategoriesListUrl(params ?? undefined),
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "WaitlistCampaignCategory" as const,
                id: category._id,
              })),
              { type: "WaitlistCampaignCategory", id: "LIST" },
            ]
          : [{ type: "WaitlistCampaignCategory", id: "LIST" }],
    }),
    getWaitlistCampaignCategoryById: builder.query<
      WaitlistCampaignCategory,
      string
    >({
      query: (id) => API_PATHS.WAITLIST_CAMPAIGN_CATEGORY_BY_ID(id),
      providesTags: (_result, _error, id) => [
        { type: "WaitlistCampaignCategory", id },
      ],
    }),
    createWaitlistCampaignCategory: builder.mutation<
      WaitlistCampaignCategory,
      CreateWaitlistCampaignCategoryRequest
    >({
      query: (body) => ({
        url: API_PATHS.WAITLIST_CAMPAIGN_CATEGORIES,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "WaitlistCampaignCategory", id: "LIST" }],
    }),
    updateWaitlistCampaignCategory: builder.mutation<
      WaitlistCampaignCategory,
      { id: string } & UpdateWaitlistCampaignCategoryRequest
    >({
      query: ({ id, ...body }) => ({
        url: API_PATHS.WAITLIST_CAMPAIGN_CATEGORY_BY_ID(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "WaitlistCampaignCategory", id },
        { type: "WaitlistCampaignCategory", id: "LIST" },
        { type: "WaitlistEntry", id: "LIST" },
      ],
    }),
    deleteWaitlistCampaignCategory: builder.mutation<
      WaitlistCampaignCategory,
      string
    >({
      query: (id) => ({
        url: API_PATHS.WAITLIST_CAMPAIGN_CATEGORY_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "WaitlistCampaignCategory", id: "LIST" }],
    }),
  }),
});

export const {
  useListWaitlistEntriesQuery,
  useGetWaitlistEntryByIdQuery,
  useUpdateWaitlistEntryMutation,
  useDeleteWaitlistEntryMutation,
  useListWaitlistCampaignCategoriesQuery,
  useGetWaitlistCampaignCategoryByIdQuery,
  useCreateWaitlistCampaignCategoryMutation,
  useUpdateWaitlistCampaignCategoryMutation,
  useDeleteWaitlistCampaignCategoryMutation,
} = waitlistApi;
