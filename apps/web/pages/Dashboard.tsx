import { ref } from "firebase/database";
import { useList } from "react-firebase-hooks/database";

import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { getUserInfo } from "../api/user";
import { signOut } from "firebase/auth";

import { auth, database } from "./_app";
import SignIn from "./SignIn";
import RegisterForm from "../components/RegisterForm";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const uid = user?.providerData[0]?.uid;
  const [snapshots, loading, error] = useList(ref(database, `user/${uid}/repos`));

  const { isLoading, data } = useQuery("userinfo", getUserInfo);

  return (
    <div className="App">
      <header>
        <h1>Buildtray</h1>
      </header>

      {user && (isLoading ? "Loading session..." : JSON.stringify(data))}
      {user ? (
        <>
          <h4>Logged in as {user.displayName}</h4>
          <button onClick={() => signOut(auth)}>Logout</button>
          <hr />
          Test: {`user/${uid}/repos`}
          <hr />
          <RegisterForm />
        </>
      ) : (
        <SignIn />
      )}

      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}

      {!loading &&
        snapshots &&
        snapshots.map(doc => {
          const items = Object.entries(doc.val());
          return JSON.stringify(items);
        })}
    </div>
  );
}
