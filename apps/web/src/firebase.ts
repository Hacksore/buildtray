import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAuth } from "firebase/auth";

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

if (process.env.NODE_ENV !== "production") {
  connectDatabaseEmulator(database, "localhost", 9000);
}
