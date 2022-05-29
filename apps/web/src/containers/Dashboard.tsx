import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllUserRepos } from "../api/user";
import { Button, darken, styled, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { subscribeToRepo, unsubscribeFromRepo } from "../api/user";
import IRepo from "shared/types/IRepo";
import DefaultLayout from "./DefaultLayout";
import { useLocation } from "react-router-dom";
import { unsafeName } from "shared/utils/naming";
import { RepoFilter } from "../components/RepoFilter";
import { useSelector } from "react-redux";
import SubscribeIcon from "@mui/icons-material/NotificationsNone";
import UnsubscribeIcon from "@mui/icons-material/Notifications";

const StyledBox = styled(Box)(({ theme }) => ({
  "& .item": {
    width: "100%",
    height: 48,
    margin: 1,
    paddingLeft: 12,
    paddingRight: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "&:hover": {
      background: darken(theme.palette.background.default, 0.03),
    },
  },
  "& .link": {
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
}));

function Dashboard() {
  const queryClient = useQueryClient();
  const searchTerm = useSelector((state: any) => state.main.repoFilterText);

  // @ts-ignore
  const subMutation: any = useMutation((data: IRepo & { type: string }) => {
    if (data.type === "sub") {
      subscribeToRepo(data);
    } else {
      unsubscribeFromRepo(data);
    }
  });

  const { isLoading, data: allUserRepos } = useQuery("allRepos", getAllUserRepos, {
    initialData: [],
  });

  // TODO: nice skelly?
  if (isLoading) {
    return <h2>loading....</h2>;
  }

  const handleRepoSubscribe = (repo: IRepo) => {
    const [entity, name] = repo.fullName.split("/");

    subMutation.mutate(
      {
        type: repo.subscribed ? "unsub" : "sub",
        entity,
        repo: name,
      },
      {
        onSuccess: () => {
          const updatedList = allUserRepos.map((tempRepo: IRepo) => {
            if (tempRepo.fullName === repo.fullName) {
              tempRepo.subscribed = !tempRepo.subscribed;
            }

            return tempRepo;
          });
          queryClient.setQueryData("allRepos", updatedList);
        },
      }
    );
  };

  return (
    <StyledBox sx={{ display: "flex", flexDirection: "column", p: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography sx={{ mr: 1 }} variant="subtitle1">
          Missing a repository?
        </Typography>
        <a className="link" target="_blank" href={import.meta.env.VITE_BUILDTRAY_APP_URL}>
          <Typography>Adjust GitHub App Permissions →</Typography>
        </a>
      </Box>
      <RepoFilter />

      {allUserRepos
        .filter((item: IRepo) => item.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((repo: IRepo) => {
          return (
            <Box key={repo.fullName} className="item">
              <Typography sx={{ flex: 1 }}>{unsafeName(repo.fullName)}</Typography>
              <Button
                disabled={!repo.installed}
                size="small"
                variant="contained"
                onClick={() => handleRepoSubscribe(repo)}
              >
                <Tooltip title={repo.subscribed ? "Unsubscribe" : "Subscribe"}>
                  {repo.subscribed ? <UnsubscribeIcon /> : <SubscribeIcon />}
                </Tooltip>
              </Button>
            </Box>
          );
        })}
    </StyledBox>
  );
}

export default () => {
  return (
    <DefaultLayout>
      <Dashboard />
    </DefaultLayout>
  );
};
