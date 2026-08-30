import { baseApi } from "@/store/api/baseApi";
import type {
  CreateSettingCategoryRequest,
  InsertSettingRequest,
  Setting,
  SettingCategory,
  UpdateSettingCategoryRequest,
  UpdateSettingRequest,
} from "@/types/settings";
import { API_PATHS } from "@/utils/constants";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSettings: builder.query<Setting[], void>({
      query: () => API_PATHS.SETTINGS,
      providesTags: (result) =>
        result
          ? [
              ...result.map((setting) => ({
                type: "Setting" as const,
                id: setting.key,
              })),
              { type: "Setting", id: "LIST" },
            ]
          : [{ type: "Setting", id: "LIST" }],
    }),
    getSettingsByCategory: builder.query<Setting[], string>({
      query: (category) => API_PATHS.SETTINGS_CATEGORY(category),
      providesTags: (result, _error, category) =>
        result
          ? [
              ...result.map((setting) => ({
                type: "Setting" as const,
                id: setting.key,
              })),
              { type: "Setting", id: `CATEGORY-${category}` },
              { type: "Setting", id: "LIST" },
            ]
          : [
              { type: "Setting", id: `CATEGORY-${category}` },
              { type: "Setting", id: "LIST" },
            ],
    }),
    getSettingByKey: builder.query<Setting, string>({
      query: (key) => API_PATHS.SETTING_BY_KEY(key),
      providesTags: (_result, _error, key) => [{ type: "Setting", id: key }],
    }),
    insertSetting: builder.mutation<Setting, InsertSettingRequest>({
      query: (body) => ({
        url: API_PATHS.SETTINGS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Setting", id: "LIST" }],
    }),
    updateSetting: builder.mutation<
      Setting,
      { key: string } & UpdateSettingRequest
    >({
      query: ({ key, ...body }) => ({
        url: API_PATHS.SETTING_BY_KEY(key),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { key }) => [
        { type: "Setting", id: key },
        { type: "Setting", id: "LIST" },
      ],
    }),
    listSettingCategories: builder.query<SettingCategory[], void>({
      query: () => API_PATHS.SETTING_CATEGORIES,
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "SettingCategory" as const,
                id: category._id,
              })),
              { type: "SettingCategory", id: "LIST" },
            ]
          : [{ type: "SettingCategory", id: "LIST" }],
    }),
    createSettingCategory: builder.mutation<
      SettingCategory,
      CreateSettingCategoryRequest
    >({
      query: (body) => ({
        url: API_PATHS.SETTING_CATEGORIES,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SettingCategory", id: "LIST" }],
    }),
    updateSettingCategory: builder.mutation<
      SettingCategory,
      { id: string } & UpdateSettingCategoryRequest
    >({
      query: ({ id, ...body }) => ({
        url: API_PATHS.SETTING_CATEGORY_BY_ID(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SettingCategory", id },
        { type: "SettingCategory", id: "LIST" },
        { type: "Setting", id: "LIST" },
      ],
    }),
    deleteSettingCategory: builder.mutation<SettingCategory, string>({
      query: (id) => ({
        url: API_PATHS.SETTING_CATEGORY_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "SettingCategory", id: "LIST" },
        { type: "Setting", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListSettingsQuery,
  useGetSettingsByCategoryQuery,
  useGetSettingByKeyQuery,
  useInsertSettingMutation,
  useUpdateSettingMutation,
  useListSettingCategoriesQuery,
  useCreateSettingCategoryMutation,
  useUpdateSettingCategoryMutation,
  useDeleteSettingCategoryMutation,
} = settingsApi;
