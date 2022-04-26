import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IBuildInfo from "shared/types/IBuildInfo";

export interface BuildState {
  builds: IBuildInfo[];
}

const initialState: BuildState[] = [
  
];

export const buildSlice = createSlice({
  name: "builds",
  initialState,
  reducers: {
    addBuild: (state, action: PayloadAction<IBuildInfo>) => {
      state.push(action.payload);
    },
    updateBuild(state, action: PayloadAction<IBuildInfo>) {
      // @ts-ignore
      const index = state.findIndex((b: IBuildInfo) => b.id === action.payload.id);
      if (index !== -1) {
        //@ts-ignore
        state[index] = action.payload;
      }
    }
  },
});

export default buildSlice.reducer;
