import { darken, Skeleton, styled } from "@mui/material";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import { useEffect } from "react";
import { useQuery } from "react-query";
import IBuildInfo from "shared/types/IBuildInfo";
import { getSubscribedRepos } from "../api/user";
import firebaseService from "../service/firebase";
import { buildSlice } from "../reducers/buildReducer";
import moment from "moment";
import { useSelector } from "react-redux";

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

const ListItem = ({ fullName, status, conclusion, commit, createdAt, url }: IBuildInfo) => {
  const timeAgo = moment.unix(createdAt).fromNow();
  const iconClass = status === "queued" ? "queued" : conclusion;
  return (
    <a target="__blank" href={url} className="build">
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
  const builds = useSelector((state: any) => state.builds);
  
  const sortedBuilds = [...builds].sort((a: IBuildInfo) => {
    if (a.status === "queued") {
      return -1;
    }

    return 0;
  });

  return (
    <StyledBox>
      <Box className="wrapper">
        { sortedBuilds.map((build: IBuildInfo, id) => <ListItem key={`${build.id}-${id}`} {...build} />) }
      </Box>
    </StyledBox>
  );
};
