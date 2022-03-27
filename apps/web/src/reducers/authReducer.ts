import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  authToken: any,
  user: any,
}

const initialState: AppState = {
  authToken: null,
  user: null,
};

export const appSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export default appSlice.reducer;