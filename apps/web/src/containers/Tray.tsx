import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";

import { auth } from "../main";
import { useEffect, useState } from "react";
import { getSubscribedRepos } from "../api/user";
import { useAppSelector } from "../hooks/redux";
import firebaseService from "../service/firebase";
import { Box, Typography } from "@mui/material";
import { ActiveBuilds } from "../components/ActiveBuilds";
import { HistoricBuilds } from "../components/HistoricBuilds";

const RepoList = () => {
  const authToken = useAppSelector(state => state.auth.authToken);
  const { isLoading, data } = useQuery("subscribedRepos", getSubscribedRepos, {
    enabled: !!authToken,
    initialData: [],
  });

  return (
    <>
      {isLoading ? (
        <Typography variant="h5">Loading...</Typography>
      ) : (
        <ul>
          {data.map((repo: any) => (
            <li key={repo.id}>{repo.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export const Tray = () => {
  const [user, loading, error]: any = useAuthState(auth);
  const authToken = useAppSelector(state => state.auth.authToken);
  const [activeBuilds, setActiveBuilds] = useState<any>([]);
  const [recentBuilds, setRecentBuilds] = useState<any>([]);

  // get tue subscribed repos
  const { isLoading: isReposLoading, data: subscribedRepos } = useQuery("subscribedRepos", getSubscribedRepos, {
    enabled: !!authToken,
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

    for (const repo of subscribedRepos) {
      // subscribe for new changes
      firebaseService.subscribeToRepo(repo.fullName);

      // get latest builds
      fetchLatestBuilds(repo.fullName);
    }
  }, [subscribedRepos]);

  if (loading || !user) {
    return <h2>loading....</h2>;
  }

  if (subscribedRepos.length === 0) {
    return (
      <div>
        <Typography>You don`&apos;t have any subbed repos please sub to some</Typography>
        <RepoList />      
      </div>
    );
  }

  return (

    <Box>
      <Typography>Active</Typography>
      <ActiveBuilds builds={activeBuilds} />

      <Typography>History</Typography>
      <HistoricBuilds builds={recentBuilds} />
    </Box>
  );
};
