import { initializeApp } from "firebase/app";
import { ref, getDatabase, connectDatabaseEmulator } from "firebase/database";

import { useList } from "react-firebase-hooks/database";

import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfvbeE4loh8UGNeGV86oAop6n_JOnU1iU",
  authDomain: "buildtray.firebaseapp.com",
  projectId: "buildtray",
  storageBucket: "buildtray.appspot.com",
  messagingSenderId: "268408377959",
  appId: "1:268408377959:web:d784ad777ed6895554bac2",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
}

const auth = getAuth(app);

export default function App() {
  const [user] = useAuthState(auth);
  const uid = user?.providerData[0]?.uid;
  const [snapshots, loading, error] = useList(ref(database, uid));
  return (
    <div className="App">
      <header>
        <h1>Buildtray</h1>
      </header>

      <section>{user ? <h1>Logged in as {user.displayName}</h1> : <SignIn />}</section>

      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {!loading &&
        snapshots &&
        snapshots.map(doc => {
          const items = Object.entries(doc.val());
          return items.map(([_, v]: [_: any, v: any]) => {
            const { user, repo, status, id } = v;
            return (
              <div key={id}>
                {user}/{repo} - {status} ({id})
              </div>
            );
          })
        })}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GithubAuthProvider();
    provider.addScope("read:user");
    signInWithPopup(auth, provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Github
      </button>
      <p>wip</p>
    </>
  );
}
