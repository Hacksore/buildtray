import { lighten, styled } from "@mui/material";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import { useEffect } from "react";
import { useQuery } from "react-query";
import IBuildInfo from "shared/types/IBuildInfo";
import { getSubscribedRepos } from "../api/user";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import firebaseService from "../service/firebase";
import { buildSlice } from "../reducers/buildReducer";

const { addBuild, updateBuild } = buildSlice.actions;

const StyledBox = styled(Box)(({ theme }) => ({
  "& .wrapper": {
    background: "#000",
    color: "#fff",
  },
  "& .build": {
    cursor: "pointer",
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    borderRadius: 6,
    background: "#161B22",
    "&:hover": {
      background: lighten("#1B1F23", 0.2),
    },
  },
  "& .title": {
    display: "flex",
    alignItems: "center",
  },
  "& .desc": {
    display: "flex",
  },
  "& .status-icon": {
    width: 16,
    height: 16,
    marginRight: theme.spacing(1),
    borderRadius: 8,
    "&.queued": {
      background: "orange",
    },
    "&.completed": {
      background: "green",
    },
    "&.failed": {
      background: "red",
    },
  },
}));


const ListItem = ({ fullName, status, commit, createdAt, url }: IBuildInfo) => {
  return (
    <Box onClick={() => window.electron.openInBrowser(url)} className="build">
      <Box className="title">
        <Box className={clsx("status-icon", { [status]: true })} />
        <Typography>{fullName}</Typography>
      </Box>
      <Box className="desc">
        <Typography>
          {commit.author} - {commit.message} - {createdAt}
        </Typography>
      </Box>
    </Box>
  );
};

export const BuildsList = () => {
  const builds = useAppSelector(state => state.builds);
  const dispatch = useAppDispatch();

  // REST CALL RETURNS ALL REPOS YOU ARE SUBBED TO
  const { isLoading: isReposLoading, data: subscribedRepos } = useQuery("subscribedRepos", getSubscribedRepos, {
    initialData: [
    ],
  });

  // watch for repo builds i've subbed to
  useEffect(() => {
    if (!subscribedRepos || subscribedRepos.length === 0) return;

    // get all repos I have subbed to
    subscribedRepos.forEach(async (repo: IBuildInfo) => {
      // get recent builds
      // @ts-ignore
      const recentBuilds: IBuildInfo = await firebaseService.getMostRecentBuilds(repo.fullName);
      // @ts-ignore
      for (const build of recentBuilds) {
        dispatch(addBuild(build));
      }

      // sub for builds events
      firebaseService.subscribeToRepo(repo.fullName)
    });

    // listen for events
    const l = firebaseService.on("build", (build) => {
      // getting builds now let's send to redux
      if (build.status === "queued") {
        dispatch(addBuild(build));
      } else if (build.status === "completed" || build.state === "failed") {
        dispatch(updateBuild(build));
      }

      // inform electron of latest build status
      window.electron.send("toMain", {
        status: build.status,
      });
    });

    return l;

  }, [subscribedRepos]);

  const sortedBuilds = [...builds].sort((a: IBuildInfo, b: IBuildInfo) => {
    if (a.status === "queued") {
      return -1;
    }
    
    return 0;
  });

  return (
    <StyledBox>
      <Box className="wrapper">
        {sortedBuilds.map((build: IBuildInfo, id) => (
          <ListItem key={`${build.id}-${id}`} {...build} />
        ))}
      </Box>
    </StyledBox>
  );
};
