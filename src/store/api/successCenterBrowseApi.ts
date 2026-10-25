import { baseApi } from "@/store/api/baseApi";
import type {
  BrowseCategory,
  CategoryProgramsResponse,
  CreateSelectionRequest,
  ProgramDetail,
  SuccessCenterSelection,
} from "@/types/successCenterSelections";
import { API_PATHS } from "@/utils/constants";

const MY_SELECTIONS_TAG = { type: "SuccessCenterSelection", id: "ME" } as const;

/** Participant-facing Success Center browsing (free) and program selections. */
export const successCenterBrowseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBrowseCategories: builder.query<BrowseCategory[], void>({
      query: () => API_PATHS.BROWSE_CATEGORIES,
      providesTags: [{ type: "SuccessCenterCategory", id: "BROWSE" }],
    }),
    listCategoryPrograms: builder.query<CategoryProgramsResponse, string>({
      query: (categoryId) => API_PATHS.BROWSE_CATEGORY_PROGRAMS(categoryId),
      providesTags: (_result, _error, categoryId) => [
        { type: "SuccessCenterProgram", id: `BROWSE-${categoryId}` },
      ],
    }),
    getBrowseProgram: builder.query<ProgramDetail, string>({
      query: (programId) => API_PATHS.BROWSE_PROGRAM(programId),
      providesTags: (_result, _error, programId) => [
        { type: "SuccessCenterProgram", id: `BROWSE-${programId}` },
      ],
    }),
    listMySelections: builder.query<SuccessCenterSelection[], void>({
      query: () => API_PATHS.SELECTIONS_ME,
      providesTags: [MY_SELECTIONS_TAG],
    }),
    createSelection: builder.mutation<
      SuccessCenterSelection,
      CreateSelectionRequest
    >({
      query: (body) => ({ url: API_PATHS.SELECTIONS, method: "POST", body }),
      invalidatesTags: [
        MY_SELECTIONS_TAG,
        // The admin participants list shows active selection counts.
        { type: "AdminParticipant", id: "LIST" },
      ],
    }),
    removeSelection: builder.mutation<SuccessCenterSelection, string>({
      query: (id) => ({ url: API_PATHS.SELECTION_REMOVE(id), method: "PATCH" }),
      invalidatesTags: [MY_SELECTIONS_TAG, { type: "AdminParticipant", id: "LIST" }],
    }),
  }),
});

export const {
  useListBrowseCategoriesQuery,
  useListCategoryProgramsQuery,
  useGetBrowseProgramQuery,
  useListMySelectionsQuery,
  useCreateSelectionMutation,
  useRemoveSelectionMutation,
} = successCenterBrowseApi;
