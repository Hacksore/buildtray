import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "./store";

import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAuth } from "firebase/auth";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "./theme";

// TODO: move these to env maybe?
const firebaseConfig = {
  apiKey: "AIzaSyDfvbeE4loh8UGNeGV86oAop6n_JOnU1iU",
  authDomain: "buildtray.firebaseapp.com",
  projectId: "buildtray",
  storageBucket: "buildtray.appspot.com",
  messagingSenderId: "268408377959",
  appId: "1:268408377959:web:d784ad777ed6895554bac2",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

if (window.location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
