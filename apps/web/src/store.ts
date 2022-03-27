import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authReducer from "./reducers/authReducer";

const isProd = process.env.NODE_ENV === "production";

const FILTERD_EVENTS: Array<string> = [];
const logger = createLogger({
  // @ts-ignore
  predicate: (_, action) => !isProd && !FILTERD_EVENTS.includes(action.type),
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export type AuthState = ReturnType<typeof store.getState>;
export type HistoryState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AuthState, unknown, Action<string>>;