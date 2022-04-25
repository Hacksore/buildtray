import { useAuthState } from "react-firebase-hooks/auth";
import { useMutation, useQuery } from "react-query";

import { auth, queryClient } from "../main";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUserRepos, getSubscribedRepos, unsubscribeFromRepo } from "../api/user";
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
  const unsubscribeRepo: any = useMutation(data => unsubscribeFromRepo(data));

  const navigate = useNavigate();
  const uid = user?.providerData[0]?.uid;

  // TODO: this should be handleded eslewhere globally
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
      firebaseService.subscribeToRepo(repo.fullName);

      // get latest builds
      fetchLatestBuilds(repo.fullName);
    }
  }, [subscribedRepos]);

  useEffect(() => {
    if (!allUserRepos || !subscribedRepos) {
      return;
    }

    // sort if subscribed repos changes
    const data = [...allUserRepos];
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
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
      {sortedRepos.map((repo: any) => {
        const isSubscribed = subscribedRepos.find((sub: any) => sub.fullName === repo.fullName);
        return (
          <Box
            key={repo.fullName}
            sx={{
              backgroundColor: theme => (isSubscribed ? "green" : darken(theme.palette.background.default, 0.3)),
              width: "100%",
              height: 48,
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
              <Box>
                {repo.fullName}
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
                >
                  {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              </Box>
            </Tooltip>
          </Box>
        );
      })}
    </Box>
  );
}
