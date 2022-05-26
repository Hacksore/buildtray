import { useMutation, useQuery } from "react-query";
import {queryClient } from "../main";
import { useEffect } from "react";
import { getAllUserRepos, unsubscribeFromRepo } from "../api/user";
import firebaseService from "service/firebase";
import { Button, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { darken } from "@mui/system";
import { subscribeToRepo } from "../api/user";

export default function Dashboard() {
  const subscribedRepo: any = useMutation(data => subscribeToRepo(data));
  const unsubscribeRepo: any = useMutation(data => unsubscribeFromRepo(data));

  const { isLoading, data: allUserRepos } = useQuery("allUserRepos", getAllUserRepos, {
    initialData: [],
  });

  // watch for repo builds i've subbed to
  useEffect(() => {
    firebaseService.on("build", data => {
      // TODO: move this somewhere else maybe?
    });
  }, []);

  if (isLoading) {
    return <h2>loading....</h2>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
      {allUserRepos.map((repo: any) => {
        const isSubscribed = repo.isSubscribed;

        return (
          <Box
            key={repo.fullName}
            sx={{
              backgroundColor: theme => (isSubscribed ? darken(theme.palette.background.default, 0.6) : darken(theme.palette.background.default, 0.3)),
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
                          queryClient.invalidateQueries("allUserRepos");
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
