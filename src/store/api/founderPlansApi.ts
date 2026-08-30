import { baseApi } from "./baseApi";
import type {
  CreateFounderPlanRequest,
  FounderPlan,
  ToggleFounderPlanAvailabilityRequest,
  UpdateFounderPlanRequest,
} from "../../types/founderPlans";
import { API_PATHS } from "../../utils/constants";

export const founderPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listFounderPlans: builder.query<FounderPlan[], void>({
      query: () => API_PATHS.FOUNDER_PLANS,
      providesTags: (result) =>
        result
          ? [
              ...result.map((plan) => ({
                type: "FounderPlan" as const,
                id: plan._id,
              })),
              { type: "FounderPlan", id: "LIST" },
            ]
          : [{ type: "FounderPlan", id: "LIST" }],
    }),
    getFounderPlanById: builder.query<FounderPlan, string>({
      query: (id) => API_PATHS.FOUNDER_PLAN_BY_ID(id),
      providesTags: (_result, _error, id) => [{ type: "FounderPlan", id }],
    }),
    createFounderPlan: builder.mutation<FounderPlan, CreateFounderPlanRequest>({
      query: (body) => ({
        url: API_PATHS.FOUNDER_PLANS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "FounderPlan", id: "LIST" }],
    }),
    updateFounderPlan: builder.mutation<
      FounderPlan,
      { id: string } & UpdateFounderPlanRequest
    >({
      query: ({ id, ...body }) => ({
        url: API_PATHS.FOUNDER_PLAN_BY_ID(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "FounderPlan", id },
        { type: "FounderPlan", id: "LIST" },
      ],
    }),
    toggleFounderPlanAvailability: builder.mutation<
      FounderPlan,
      { id: string } & ToggleFounderPlanAvailabilityRequest
    >({
      query: ({ id, status }) => ({
        url: API_PATHS.FOUNDER_PLAN_AVAILABILITY(id),
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "FounderPlan", id },
        { type: "FounderPlan", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListFounderPlansQuery,
  useGetFounderPlanByIdQuery,
  useCreateFounderPlanMutation,
  useUpdateFounderPlanMutation,
  useToggleFounderPlanAvailabilityMutation,
} = founderPlansApi;
