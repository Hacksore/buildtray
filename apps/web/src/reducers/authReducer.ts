import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadState } from "../util/state";
export interface AppState {
  authToken: string;
  githubAccessToken: string | null;
  user: unknown;
}

const initialState: AppState = loadState({
  authToken: null,
  githubAccessToken: null,
  user: null,
});

export const appSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setGithubAccessToken: (state, action: PayloadAction<string>) => {
      state.githubAccessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<unknown>) => {
      state.user = action.payload;
    },
  },
});

export default appSlice.reducer;
