import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { logout } from "@/store/slices/authSlice";
import type { AuthState } from "@/store/slices/authSlice";
import type { ApiEnvelope } from "@/types/auth";
import { API_BASE_URL, API_PATHS } from "@/utils/constants";

const PUBLIC_AUTH_PATHS = [
  API_PATHS.LOGIN,
  API_PATHS.REGISTER,
  API_PATHS.VERIFY_EMAIL,
  API_PATHS.RESEND_LINK,
];

function requestUrl(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

function isPublicAuthRequest(args: string | FetchArgs): boolean {
  const url = requestUrl(args);
  return PUBLIC_AUTH_PATHS.some((path) => url.startsWith(path));
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 401 && !isPublicAuthRequest(args)) {
      api.dispatch(logout());
    }
    return result;
  }

  const body = result.data as ApiEnvelope<unknown> | undefined;
  if (body && typeof body === "object" && "success" in body) {
    return { data: body.data };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "LegalDocument",
    "LegalAcceptance",
    "AuditLog",
    "Setting",
    "SettingCategory",
    "FounderPlan",
    "SuccessCenterCategory",
    "SuccessCenterProgram",
  ],
  endpoints: () => ({}),
});
