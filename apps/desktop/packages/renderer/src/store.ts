import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import mainReducer from "./reducers/mainReducer";

const isProd = process.env.NODE_ENV === "production";

const FILTERD_EVENTS: Array<string> = [];
const logger = createLogger({
  // @ts-ignore
  predicate: (_, action) => !isProd && !FILTERD_EVENTS.includes(action.type),
});

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;