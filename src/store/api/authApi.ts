import { baseApi } from "@/store/api/baseApi";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  BackendUser,
  ResendLinkRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
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
    // Revokes all of the user's sessions server-side.
    logout: builder.mutation<void, void>({
      query: () => ({ url: API_PATHS.LOGOUT, method: "POST" }),
    }),
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
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
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendLinkMutation,
} = authApi;
