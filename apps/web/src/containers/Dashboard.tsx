import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { signOut } from "firebase/auth";

import { auth, database } from "../main";
import RegisterForm from "../components/RegisterForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRepos } from "../api/user";
import { useAppSelector } from "../hooks/redux";
import firebaseService from "../service/firebase";

export default function Dashboard() {
  const [user, loading, error]: any = useAuthState(auth);
  const authToken = useAppSelector(state => state.auth.authToken);
  const navigate = useNavigate();

  const uid = user?.providerData[0]?.uid;

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading]);

  const { isLoading: isReposLoading, data: allRepos = [] } = useQuery("repos", getRepos, {
    enabled: !!authToken,
  });

  // watch for repo builds i've subbed to
  useEffect(() => {
    firebaseService.on("build", data => {
      console.log("Build", data);
    });
  }, []);

  // create subs for repo builds
  useEffect(() => {
    for (const repo of allRepos) {
      firebaseService.subscribeRepo(repo.fullName);
    }
  }, [allRepos]);

  if (isReposLoading || loading || !user) {
    return <h2>loading....</h2>;
  }

  return (
    <div className="App">
      <header>
        <h1>Buildtray</h1>
      </header>

      <>
        <h4>
          Logged in as {user.displayName} {uid}
        </h4>
        <button onClick={() => signOut(auth)}>Logout</button>
        <hr />
        Test: {`user/${uid}/repos`}
        <hr />
        <RegisterForm />
        <h2>My repos</h2>
        {allRepos.map((repo: any) => (
          <p key={repo.fullName}>{JSON.stringify(repo)}</p>
        ))}
      </>
    </div>
  );
}
