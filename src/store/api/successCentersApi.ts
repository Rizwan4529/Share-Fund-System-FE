import { baseApi } from "./baseApi";
import type {
  CreateSuccessCenterCategoryRequest,
  CreateSuccessCenterProgramRequest,
  ListSuccessCenterProgramsParams,
  SuccessCenterCategory,
  SuccessCenterProgram,
  UpdateSuccessCenterCategoryRequest,
  UpdateSuccessCenterProgramRequest,
} from "../../types/successCenters";
import { API_PATHS } from "../../utils/constants";

function programsListUrl(params?: ListSuccessCenterProgramsParams): string {
  if (!params?.categoryId && !params?.status) {
    return API_PATHS.SUCCESS_CENTER_PROGRAMS;
  }
  const search = new URLSearchParams();
  if (params.categoryId) search.set("categoryId", params.categoryId);
  if (params.status) search.set("status", params.status);
  return `${API_PATHS.SUCCESS_CENTER_PROGRAMS}?${search.toString()}`;
}

export const successCentersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSuccessCenterCategories: builder.query<SuccessCenterCategory[], void>({
      query: () => API_PATHS.SUCCESS_CENTER_CATEGORIES,
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "SuccessCenterCategory" as const,
                id: category._id,
              })),
              { type: "SuccessCenterCategory", id: "LIST" },
            ]
          : [{ type: "SuccessCenterCategory", id: "LIST" }],
    }),
    getSuccessCenterCategoryById: builder.query<SuccessCenterCategory, string>({
      query: (id) => API_PATHS.SUCCESS_CENTER_CATEGORY_BY_ID(id),
      providesTags: (_result, _error, id) => [
        { type: "SuccessCenterCategory", id },
      ],
    }),
    createSuccessCenterCategory: builder.mutation<
      SuccessCenterCategory,
      CreateSuccessCenterCategoryRequest
    >({
      query: (body) => ({
        url: API_PATHS.SUCCESS_CENTER_CATEGORIES,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SuccessCenterCategory", id: "LIST" }],
    }),
    updateSuccessCenterCategory: builder.mutation<
      SuccessCenterCategory,
      { id: string } & UpdateSuccessCenterCategoryRequest
    >({
      query: ({ id, ...body }) => ({
        url: API_PATHS.SUCCESS_CENTER_CATEGORY_BY_ID(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SuccessCenterCategory", id },
        { type: "SuccessCenterCategory", id: "LIST" },
      ],
    }),
    deleteSuccessCenterCategory: builder.mutation<SuccessCenterCategory, string>(
      {
        query: (id) => ({
          url: API_PATHS.SUCCESS_CENTER_CATEGORY_BY_ID(id),
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "SuccessCenterCategory", id: "LIST" }],
      },
    ),
    listSuccessCenterPrograms: builder.query<
      SuccessCenterProgram[],
      ListSuccessCenterProgramsParams | void
    >({
      query: (params) => programsListUrl(params ?? undefined),
      providesTags: (result) =>
        result
          ? [
              ...result.map((program) => ({
                type: "SuccessCenterProgram" as const,
                id: program._id,
              })),
              { type: "SuccessCenterProgram", id: "LIST" },
            ]
          : [{ type: "SuccessCenterProgram", id: "LIST" }],
    }),
    getSuccessCenterProgramById: builder.query<SuccessCenterProgram, string>({
      query: (id) => API_PATHS.SUCCESS_CENTER_PROGRAM_BY_ID(id),
      providesTags: (_result, _error, id) => [
        { type: "SuccessCenterProgram", id },
      ],
    }),
    createSuccessCenterProgram: builder.mutation<
      SuccessCenterProgram,
      CreateSuccessCenterProgramRequest
    >({
      query: (body) => ({
        url: API_PATHS.SUCCESS_CENTER_PROGRAMS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SuccessCenterProgram", id: "LIST" }],
    }),
    updateSuccessCenterProgram: builder.mutation<
      SuccessCenterProgram,
      { id: string } & UpdateSuccessCenterProgramRequest
    >({
      query: ({ id, ...body }) => ({
        url: API_PATHS.SUCCESS_CENTER_PROGRAM_BY_ID(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SuccessCenterProgram", id },
        { type: "SuccessCenterProgram", id: "LIST" },
      ],
    }),
    deleteSuccessCenterProgram: builder.mutation<SuccessCenterProgram, string>({
      query: (id) => ({
        url: API_PATHS.SUCCESS_CENTER_PROGRAM_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SuccessCenterProgram", id: "LIST" }],
    }),
  }),
});

export const {
  useListSuccessCenterCategoriesQuery,
  useGetSuccessCenterCategoryByIdQuery,
  useCreateSuccessCenterCategoryMutation,
  useUpdateSuccessCenterCategoryMutation,
  useDeleteSuccessCenterCategoryMutation,
  useListSuccessCenterProgramsQuery,
  useGetSuccessCenterProgramByIdQuery,
  useCreateSuccessCenterProgramMutation,
  useUpdateSuccessCenterProgramMutation,
  useDeleteSuccessCenterProgramMutation,
} = successCentersApi;
