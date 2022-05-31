import { darken, Skeleton, styled } from "@mui/material";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import { useEffect } from "react";
import { useQuery } from "react-query";
import IBuildInfo from "shared/types/IBuildInfo";
import { getSubscribedRepos } from "../api/user";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import firebaseService from "service/firebase";
import { buildSlice } from "../reducers/buildReducer";
import moment from "moment";

const { addBuild, updateBuild } = buildSlice.actions;

const StyledBox = styled(Box)(({ theme }) => ({
  "& .wrapper": {},
  "& .build": {
    textDecoration: "none",
    color: theme.palette.text.primary,
    cursor: "pointer",
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    borderRadius: 6,
    background: theme.palette.background.default,
    "&:hover": {
      background: darken(theme.palette.background.default, 0.05),
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
    "&.success": {
      background: "green",
    },
    "&.failure": {
      background: "red",
    },
  },
}));

const handleElectronLaunch = (event: React.MouseEvent, url: string) => {
  if (window.electron !== undefined) {
    event.preventDefault();
    window.electron.openInBrowser(url);
  }
};

const ListItem = ({ fullName, status, conclusion, commit, createdAt, url }: IBuildInfo) => {
  const timeAgo = moment.unix(createdAt).fromNow();
  const iconClass = status === "queued" ? "queued" : conclusion;
  return (
    <a onClick={event => handleElectronLaunch(event, url)} target="__blank" href={url} className="build">
      <Box className="title">
        <Box className={clsx("status-icon", { [iconClass]: true })} />
        <Typography>{fullName}</Typography>
      </Box>
      <Box sx={{ display: "flex" }} className="desc">
        <Typography sx={{ mr: 1, flex: 3 }}>
          {commit.author} - {commit.message.split("\n")[0]}
        </Typography>
        <Typography sx={{ mr: 1 }}>{timeAgo}</Typography>
      </Box>
    </a>
  );
};

export const BuildsList = () => {
  const builds = useAppSelector(state => state.builds);
  const dispatch = useAppDispatch();

  // REST CALL RETURNS ALL REPOS YOU ARE SUBBED TO
  const { isLoading: isReposLoading, data: subscribedRepos } = useQuery("subscribedRepos", getSubscribedRepos, {
    initialData: [],
  });

  // watch for repo builds i've subbed to
  useEffect(() => {
    if (!subscribedRepos || subscribedRepos.length === 0) return;

    // get all repos I have subbed to
    subscribedRepos.forEach(async (repo: IBuildInfo) => {
      // get recent builds
      const recentBuilds: IBuildInfo[] = await firebaseService.getMostRecentBuilds(repo.fullName);
      for (const build of recentBuilds) {
        dispatch(addBuild(build));
      }

      // sub for builds events
      firebaseService.subscribeToRepo(repo.fullName);
    });

    // listen for events
    firebaseService.on("build", (build: IBuildInfo) => {
      // getting builds now let's send to redux
      if (build.status === "queued") {
        dispatch(addBuild(build));
      } else if (build.status === "completed" || build.status === "failure") {
        dispatch(updateBuild(build));
      }

      // spawn notification
      let statusIcon = "⏳";
      let statusText = "started";
      if (build.conclusion === "success") {
        statusIcon = "✅";
        statusText = "completed";
      }
      if (build.conclusion === "failure") {
        statusIcon = "🛑";
        statusText = "failed";
      }

      const title = `${statusIcon} ${build.fullName} build ${statusText}`;
      const body = `@${build.user.sender} - ${build.commit.message}`;
      const notification = new Notification(title, { body, icon: "/logo.svg" });
      notification.onclick = function (event) {
        event.preventDefault();
        window.open(build.url, "_blank");
      };

      // inform electron of latest build status
      window.electron.send("toMain", {
        status: build.status,
      });
    });

    return () => firebaseService.clearAllListeners();
  }, [subscribedRepos]);

  const sortedBuilds = [...builds].sort((a: IBuildInfo) => {
    if (a.status === "queued") {
      return -1;
    }

    return 0;
  });

  return (
    <StyledBox>
      <Box className="wrapper">
        {isReposLoading
          ? Array(10)
              .fill(0)
              .map((_, idx) => {
                return <Skeleton key={`skelly-${idx}`} />;
              })
          : sortedBuilds.map((build: IBuildInfo, id) => <ListItem key={`${build.id}-${id}`} {...build} />)}
      </Box>
    </StyledBox>
  );
};
