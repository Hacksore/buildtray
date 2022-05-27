import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllUserRepos } from "../api/user";
import { Button, darken, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { subscribeToRepo, unsubscribeFromRepo } from "../api/user";
import IRepo from "shared/types/IRepo";
import DefaultLayout from "./DefaultLayout";
import { useLocation } from "react-router-dom";
import { unsafeName } from "shared/utils/naming";
import { RepoFilter } from "../components/RepoFilter";
import { useSelector } from "react-redux";

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
      background: darken(theme.palette.background.default, 0.05),
    },
  },
}));

function Dashboard() {
  const queryClient = useQueryClient();
  const searchTerm = useSelector((state: any) => state.main.repoFilterText);

  // @ts-ignore
  const subMutation: any = useMutation((data: any) => {
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
          const updatedList = allUserRepos.map(r => {
            if (r.fullName === repo.fullName) {
              r.subscribed = !r.subscribed;
            }

            return r;
          });
          queryClient.setQueryData("allRepos", updatedList);
        },
      }
    );
  };

  return (
    <StyledBox sx={{ display: "flex", flexDirection: "column", p: 3 }}>
      <Typography variant="subtitle1">
        This page displays all the repos you have granted Buildtray access to. You can update repos we have acces to at
        anytime on the settings page.
      </Typography>
      <Box>
        <Button
          target="_blank"
          href={import.meta.env.VITE_BUILDTRAY_APP_URL}
        >
          <Typography>Install app to your github account</Typography>
        </Button>
      </Box>

      <RepoFilter />

      {allUserRepos
        .sort((a: IRepo) => (a.subscribed || a.installed ? -1 : 1))
        .filter((item: IRepo) => item.fullName.includes(searchTerm))
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
                {repo.subscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            </Box>
          );
        })}
    </StyledBox>
  );
}

export default () => {
  const location = useLocation();
  const path = location.pathname;
  const pathToComponent = {
    "/dashboard": Dashboard,
    "/dashboard/settings": () => <h2>settings</h2>,
    "/dashboard/browse": () => <h2>browse</h2>,
  };

  // @ts-ignore
  const Component = pathToComponent[path];

  return (
    <DefaultLayout>
      <Component />
    </DefaultLayout>
  );
};
