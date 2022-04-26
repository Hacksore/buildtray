import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authReducer from "./reducers/authReducer";
import buildsReducer from "./reducers/buildReducer";
import { saveState } from "./util/state";

const isProd = process.env.NODE_ENV === "production";

const FILTERD_EVENTS: Array<string> = [];
const logger = createLogger({
  // @ts-ignore
  predicate: (_, action) => !isProd && !FILTERD_EVENTS.includes(action.type),
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    builds: buildsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export type AuthState = ReturnType<typeof store.getState>;
export type HistoryState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AuthState, unknown, Action<string>>;

// sub to store for changes to save to localstorage
// TODO: right now this is being user to save auth to localstorage
store.subscribe(() => {
  const state = store.getState();
  saveState(state.auth);
});
