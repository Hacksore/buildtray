import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IBuildInfo from "shared/types/IBuildInfo";

type BuildState = Array<IBuildInfo>;
const initialState: BuildState = [];

export const buildSlice = createSlice({
  name: "builds",
  initialState,
  reducers: {
    addBuild: (state, action: PayloadAction<IBuildInfo>) => {
      state.push(action.payload);
    },
    updateBuild(state, action: PayloadAction<IBuildInfo>) {
      const index = state.findIndex((b: IBuildInfo) => b.id === action.payload.id);
      if (index !== -1) {
        state[index].status = action.payload.status;
        state[index].conclusion = action.payload.conclusion;
      }
    },
    clearBuilds: () => {
      return initialState;
    },
  },
});

export default buildSlice.reducer;
