import { useAuthState } from "react-firebase-hooks/auth";
import { useMutation, useQuery } from "react-query";

import { auth, queryClient } from "../main";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUserRepos, getSubscribedRepos, unsubscribeToRepo } from "../api/user";
import { useAppSelector } from "../hooks/redux";
import firebaseService from "../service/firebase";
import { Button, Grid, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { darken } from "@mui/system";
import { subscribeToRepo } from "../api/user";

export default function Dashboard() {
  const [user, loading, error]: any = useAuthState(auth);
  const [activeBuilds, setActiveBuilds] = useState<any>([]);
  const [recentBuilds, setRecentBuilds] = useState<any>([]);
  const [sortedRepos, setSortedRepos] = useState<any>([]);
  const authToken = useAppSelector(state => state.auth.authToken);
  const subscribedRepo: any = useMutation(data => subscribeToRepo(data));
  const unsubscribeRepo: any = useMutation(data => unsubscribeToRepo(data));

  const navigate = useNavigate();

  const uid = user?.providerData[0]?.uid;

  // TODO: this should be handleded eslewhere
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading]);

  const { isLoading: isReposLoading, data: subscribedRepos } = useQuery("subscribedRepos", getSubscribedRepos, {
    enabled: !!authToken,
    initialData: [],
  });

  const { isLoading: isAllReposLoading, data: allUserRepos } = useQuery("allUserRepos", getAllUserRepos, {
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
      firebaseService.subscribeRepo(repo.fullName);

      // get latest builds
      fetchLatestBuilds(repo.fullName);
    }
  }, [subscribedRepos]);

  useEffect(() => {
    console.log("s", subscribedRepo)
    if(!allUserRepos || !subscribedRepos) {
      return;
    }

    // sort if subscribed repos changes
    const data =  [...allUserRepos];
    const sorted = data.sort((a: any, b: any) => {
      const found = subscribedRepos.find((sub: any) => sub.fullName === a.fullName);
      if (found) {
        return -1;
      } else {
        return 1;
      }
    });
    setSortedRepos(sorted);
  }, [subscribedRepos, allUserRepos]);

  if (loading || !user) {
    return <h2>loading....</h2>;
  }

  return (
    <>
      <h4>
        Logged in as {user.displayName} {uid}
      </h4>
      Install this application for people to subscribe to build events{" "}
      <a target="_blank" rel="noreferrer" href="https://github.com/apps/buildtray">
        https://github.com/apps/buildtray
      </a>
      <hr />
      <h2>My subscribed repos</h2>
      {subscribedRepos.map((repo: any) => (
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
      <Grid container>
        {sortedRepos.map((repo: any) => {
          const isSubscribed = subscribedRepos.find((sub: any) => sub.fullName === repo.fullName);
          return (
            <Grid item key={repo.fullName}>
              <Button
                onClick={() => {
                  const [entity, name] = repo.fullName.split("/");
                  const mutation = isSubscribed ? unsubscribeRepo : subscribedRepo;
                  mutation.mutate(
                    {
                      entity,
                      repo: name,
                    },                
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries("subscribedRepos");
                      },
                    }
                  );
                }}
                sx={{
                  backgroundColor: theme => (isSubscribed ? "green" : darken(theme.palette.background.default, 0.3)),
                  width: 300,
                  height: 100,
                  margin: 1,
                  padding: 1,
                  display: "flex",
                  fontWeight: "bold",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Tooltip title={repo.fullName}>
                  <Box
                    sx={{
                      textAlign: "center",
                      width: 250,
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {repo.fullName}
                  </Box>
                </Tooltip>
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
