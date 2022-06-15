import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import buildsReducer from "./reducers/buildReducer";
import mainSlice from "./reducers/mainSlice";

const isProd = process.env.NODE_ENV === "production";

const FILTERD_EVENTS: Array<string> = [];
const logger = createLogger({
  predicate: (_, action) => !isProd && !FILTERD_EVENTS.includes(action.type),
});

export const store = configureStore({
  reducer: {
    main: mainSlice,
    // TODO: rename
    builds: buildsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type AuthState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AuthState, unknown, Action<string>>;
