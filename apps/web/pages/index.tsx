import { initializeApp } from "firebase/app";
import { getFirestore, collection, connectFirestoreEmulator } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

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

// console.log(firebase)
const app = initializeApp(firebaseConfig);
const db = getFirestore();

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

const auth = getAuth(app);
const firestore = getFirestore(app);

export default function App() {
  const [user] = useAuthState(auth);

  const [value] = useCollection(collection(firestore, "builds"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  return (
    <div className="App">
      <header>
        <h1>Buildtray</h1>
      </header>

      <section>{user ? <h1>Logged in as {user.displayName}</h1> : <SignIn />}</section>

      {value &&
        value.docs.map(doc => {
          const build = doc.data();
          const { user, repo, status, id } = build;
          return <div>{user}/{repo} - {status} ({id})</div>;
        })}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GithubAuthProvider();
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
