import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  repoFilterText: string;
}

const initialState: AppState = {
  repoFilterText: "",
};

export const appSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setRepoFilterText: (state, action: PayloadAction<string>) => {
      state.repoFilterText = action.payload;
    },
  },
});

export default appSlice.reducer;
