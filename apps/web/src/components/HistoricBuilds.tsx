import { lighten, styled } from "@mui/material";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import IBuildInfo from "shared/types/IBuildInfo";

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
    }
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
interface HistoricBuildsProps {
  // TODO: type a build
  builds: any[];
}

const ListItem = ({ fullName, status, actor, commit }: IBuildInfo) => {
  return (
    <Box className="build">
      <Box className="title">
        <Box className={clsx("status-icon", { [status]: true })} />
        <Typography>{fullName}</Typography>
      </Box>
      <Box className="desc">
        <Typography>{actor} - {commit.message}</Typography>
      </Box>
    </Box>
  );
};

export const HistoricBuilds = ({ builds }: HistoricBuildsProps) => {
  return (
    <StyledBox>
      <Box className="wrapper">
        {builds.map((build: IBuildInfo) => (
          <ListItem key={build.id} {...build} />
        ))}
      </Box>
    </StyledBox>
  );
};
