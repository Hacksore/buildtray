import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_STATE } from "../types/loadingStates";

export interface AppState {
  repoFilterText: string;
  authState: AUTH_STATE;
  appMounted: boolean;
}

const initialState: AppState = {
  repoFilterText: "",
  authState: AUTH_STATE.LOADING,
  appMounted: false,
};

export const appSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setRepoFilterText: (state, action: PayloadAction<string>) => {
      state.repoFilterText = action.payload;
    },
    setAuthState(state, action: PayloadAction<AUTH_STATE>) {
      state.authState = action.payload;
    },
    setAppMounted(state, action: PayloadAction<boolean>) {
      state.appMounted = action.payload;
    },
  },
});

export default appSlice.reducer;
