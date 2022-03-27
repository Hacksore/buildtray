import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  authToken: any
}

const initialState: AppState = {
  authToken: null
};

export const appSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
  },
});

export default appSlice.reducer;