import { baseApi } from "@/store/api/baseApi";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  BackendUser,
  ResendLinkRequest,
  VerifyEmailRequest,
} from "@/types/auth";
import { API_PATHS } from "@/utils/constants";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: API_PATHS.LOGIN,
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<BackendUser, RegisterRequest>({
      query: (body) => ({
        url: API_PATHS.REGISTER,
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation<void, VerifyEmailRequest>({
      query: (body) => ({
        url: API_PATHS.VERIFY_EMAIL,
        method: "POST",
        body,
      }),
    }),
    resendLink: builder.mutation<void, ResendLinkRequest>({
      query: (body) => ({
        url: API_PATHS.RESEND_LINK,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendLinkMutation,
} = authApi;
