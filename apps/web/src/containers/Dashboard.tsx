import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { signOut } from "firebase/auth";

import { auth } from "../main";
import RegisterForm from "../components/RegisterForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUserRepos, getRepos } from "../api/user";
import { useAppSelector } from "../hooks/redux";
import firebaseService from "../service/firebase";

export default function Dashboard() {
  const [user, loading, error]: any = useAuthState(auth);
  const [activeBuilds, setActiveBuilds] = useState<any>([]);
  const [recentBuilds, setRecentBuilds] = useState<any>([]);
  const authToken = useAppSelector(state => state.auth.authToken);
  const navigate = useNavigate();

  const uid = user?.providerData[0]?.uid;

  // TODO: this should be handleded eslewhere
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading]);

  const { isLoading: isReposLoading, data: allRepos } = useQuery("repos", getRepos, {
    enabled: !!authToken,
    initialData: [],
  });

  const { isLoading: isAllReposLoading, data: allUserRepos } = useQuery("alllRepos", getAllUserRepos, {
    initialData: [],
  });

  // watch for repo builds i've subbed to
  useEffect(() => {
    firebaseService.on("build", data => {
      setActiveBuilds((currentBuilds: any) => [...currentBuilds, data]);

      // make a demo notification fow now
      let status;
      switch (data.status) {
        case "requested":
          status = "Build was started ⏱";
          break;
        case "completed":
          status = "Build was completed successfully ✅";
          break;
        case "failed":
          status = "Build has failed 🚨";
          break;
        default:
          status = "Unknown 👽";
      }

      new Notification(`[Buildtray] ${data.fullName}`, {
        body: status,
        icon: "/build.png",
      });
    });
  }, []);

  // create subs for repo builds
  useEffect(() => {
    // fetch most recent builds
    const fetchLatestBuilds = async (path: string) => {
      const builds: any = await firebaseService.getMostRecentBuilds(path);
      setRecentBuilds((existing: any) => [...existing, ...builds]);
    };

    for (const repo of allRepos) {
      // subscribe for new changes
      firebaseService.subscribeRepo(repo.fullName);

      // get latest builds
      fetchLatestBuilds(repo.fullName);
    }
  }, [allRepos]);

  if (loading || !user) {
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
        Install this application to your repo to be able for uses to subscribe to build events
        <a target="_blank" rel="noreferrer" href="https://github.com/apps/buildtray">
          https://github.com/apps/buildtray
        </a>
        <hr />
        <RegisterForm />
        <h2>Install repos</h2>
        {allRepos.map((repo: any) => (
          <p key={repo.fullName}>{repo.fullName}</p>
        ))}
        <h2>My subscribed repos</h2>
        {allRepos.map((repo: any) => (
          <p key={repo.fullName}>{repo.fullName}</p>
        ))}
        <h2>Incoming builds</h2>
        {activeBuilds.map((build: any) => (
          <pre key={`${build.id}-${build.createdAt}`}>{JSON.stringify(build, null, 2)}</pre>
        ))}
        <h2>Recent builds</h2>
        {recentBuilds.map((build: any) => (
          <pre key={`${build.id}-${build.createdAt}`}>{JSON.stringify(build, null, 2)}</pre>
        ))}
        <h2>All repos</h2>
        <div style={{ width: 1200 }}>
          {allUserRepos.map((repo: any) => (
            <div style={{ width: 200, height: 100, background: "red", float: "left", marginRight: 10 }} key={repo.fullName}>
              {repo.fullName}
            </div>
          ))}
        </div>
      </>
    </div>
  );
}
