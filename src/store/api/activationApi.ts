import { baseApi } from "@/store/api/baseApi";
import type {
  ActivationPlan,
  CalculateActivationResponse,
} from "@/types/activation";
import { API_PATHS } from "@/utils/constants";

/** Activation requirement plans — the backend is the only calculator. */
export const activationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** The stored plan; 404 until one has been calculated. */
    getActivationPlan: builder.query<ActivationPlan, string>({
      query: (selectionId) => API_PATHS.ACTIVATION_FOR_SELECTION(selectionId),
      providesTags: (_result, _error, selectionId) => [
        { type: "ActivationPlan", id: selectionId },
      ],
    }),
    calculateActivation: builder.mutation<CalculateActivationResponse, string>({
      query: (selectionId) => ({
        url: API_PATHS.ACTIVATION_CALCULATE,
        method: "POST",
        body: { selectionId },
      }),
      // Put a freshly calculated plan straight into the GET cache so the
      // page shows it without a second request.
      async onQueryStarted(selectionId, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data?.activationRequired) {
          dispatch(
            activationApi.util.upsertQueryData(
              "getActivationPlan",
              selectionId,
              data.recommendation,
            ),
          );
        }
      },
    }),
  }),
});

export const { useGetActivationPlanQuery, useCalculateActivationMutation } =
  activationApi;
