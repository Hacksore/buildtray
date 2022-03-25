import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

import { getAuth } from "firebase/auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { AppProps } from "next/app";

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

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
}

export const auth = getAuth(app);

export default function Main({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
