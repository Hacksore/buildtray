import { useMutation, useQuery } from "react-query";
import { queryClient } from "../main";
import { getAllUserRepos } from "../api/user";
import { Button, darken, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { subscribeToRepo } from "../api/user";
import IBuildInfo from "shared/types/IBuildInfo";
import DefaultLayout from "./DefaultLayout";
import { useLocation } from "react-router-dom";
import { unsafeName } from "shared/utils/naming";
import { Report } from "@mui/icons-material";
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
  const searchTerm = useSelector((state: any) => state.main.repoFilterText);
  const subscribedRepo: any = useMutation(data => subscribeToRepo(data));
  const { isLoading, data: allUserRepos } = useQuery("allUserRepos", getAllUserRepos, {
    initialData: [],
  });

  if (isLoading) {
    return <h2>loading....</h2>;
  }

  return (
    <StyledBox sx={{ display: "flex", flexDirection: "column", p: 3 }}>
      <Typography variant="subtitle1">
        This page displays all the repos you have granted Buildtray access to. You can update repos we have acces to at
        anytime on the settings page.
      </Typography>

      <RepoFilter />

      {allUserRepos
        .filter((item: IBuildInfo) => item.fullName.includes(searchTerm))
        .map((repo: IBuildInfo) => {
          return (
            <Box key={repo.fullName} className="item">
              <Typography sx={{ flex: 1 }}>{unsafeName(repo.fullName)}</Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  const [entity, name] = repo.fullName.split("/");
                  subscribedRepo.mutate(
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
                Subscribe
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
