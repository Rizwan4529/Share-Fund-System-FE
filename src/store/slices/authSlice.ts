import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  clearAuth,
  isRememberedAuth,
  loadAuth,
  saveAuth,
} from "@/store/persist";
import type { BackendUser } from "@/types/auth";

export type AuthState = {
  user: BackendUser | null;
  token: string | null;
  remember: boolean;
};

const persisted = loadAuth();

const initialState: AuthState = {
  user: persisted?.user ?? null,
  token: persisted?.token ?? null,
  remember: isRememberedAuth(),
};

type SetCredentialsPayload = {
  user: BackendUser;
  token: string;
  remember: boolean;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<SetCredentialsPayload>) {
      const { user, token, remember } = action.payload;
      state.user = user;
      state.token = token;
      state.remember = remember;
      saveAuth({ user, token }, remember);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.remember = false;
      clearAuth();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
