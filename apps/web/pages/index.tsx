import { ref } from "firebase/database";

import { useList } from "react-firebase-hooks/database";

import { getIdToken } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { getUserInfo } from "../api/user";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import { auth, database } from "./_app";
import SignIn from "./SignIn";

export default function App() {
  const [user] = useAuthState(auth);
  const uid = user?.providerData[0]?.uid;
  const [snapshots, loading, error] = useList(ref(database, uid));
  const [token, setToken] = useState(null);

  // this works but can we abstract this away somehow
  useEffect(() => {
    const fetchJwt = async () => {
      if (!auth?.currentUser) {
        return;
      }
      const jwt = await getIdToken(auth?.currentUser);
      setToken(jwt);
    };

    fetchJwt();
  }, [auth.currentUser]);

  const { isLoading, data } = useQuery(
    ["userinfo", token],
    () => {
      if (token) {
        return getUserInfo(token);
      } else {
        return Promise.resolve({});
      }
    },
    {
      enabled: !!token,
    }
  );

  return (
    <div className="App">
      <header>
        <h1>Buildtray</h1>
      </header>

      {user && (isLoading ? "Loading session..." : JSON.stringify(data))}

      {user ? (
        <>
          <h1>Logged in as {user.displayName}</h1>
          <button onClick={() => signOut(auth)}>Logout</button>
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
          return items.map(([_, v]: [_: any, v: any]) => {
            const { user, repo, status, id } = v;
            return (
              <div key={id}>
                {user}/{repo} - {status} ({id})
              </div>
            );
          });
        })}
    </div>
  );
}
