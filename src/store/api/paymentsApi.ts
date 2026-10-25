import { baseApi } from "@/store/api/baseApi";
import type {
  CheckoutQuote,
  CheckoutQuoteRequest,
  CheckoutSessionResponse,
  CreateCheckoutSessionRequest,
  FundingAccessPlan,
  PaymentRecord,
} from "@/types/payments";
import { API_PATHS } from "@/utils/constants";

/**
 * Stripe checkout (hosted Checkout Sessions — the browser is redirected to
 * Stripe, so no publishable key / Stripe.js is needed). Amounts are always
 * resolved by the server; payment status only ever comes from the API, which
 * the Stripe webhook updates.
 */
export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listFundingAccessPlans: builder.query<FundingAccessPlan[], void>({
      query: () => API_PATHS.PAYMENTS_FUNDING_ACCESS_PLANS,
    }),
    getCheckoutQuote: builder.query<CheckoutQuote, CheckoutQuoteRequest>({
      query: (body) => ({ url: API_PATHS.PAYMENTS_QUOTE, method: "POST", body }),
      // Always re-quote on mount: a stale price must never be shown.
      keepUnusedDataFor: 0,
    }),
    createCheckoutSession: builder.mutation<
      CheckoutSessionResponse,
      CreateCheckoutSessionRequest
    >({
      query: (body) => ({
        url: API_PATHS.PAYMENTS_CHECKOUT_SESSION,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Payment", id: "ME" }],
    }),
    listMyPayments: builder.query<PaymentRecord[], void>({
      query: () => API_PATHS.PAYMENTS_ME,
      providesTags: [{ type: "Payment", id: "ME" }],
    }),
    getPayment: builder.query<PaymentRecord, string>({
      query: (id) => API_PATHS.PAYMENT_BY_ID(id),
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),
    cancelPayment: builder.mutation<PaymentRecord, string>({
      query: (id) => ({ url: API_PATHS.PAYMENT_CANCEL(id), method: "POST" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Payment", id },
        { type: "Payment", id: "ME" },
      ],
    }),
  }),
});

export const {
  useListFundingAccessPlansQuery,
  useGetCheckoutQuoteQuery,
  useCreateCheckoutSessionMutation,
  useListMyPaymentsQuery,
  useGetPaymentQuery,
  useCancelPaymentMutation,
} = paymentsApi;
