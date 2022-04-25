import { lighten, styled } from "@mui/material";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";

const StyledBox = styled(Box)(({ theme }) => ({
  "& .wrapper": {
    background: "#000",
    color: "#fff",
  },
  "& .build": {
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    borderRadius: 6,
    background: "#161B22",
    "&:hover": {
      background: lighten("#1B1F23", 0.2),
    }
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
interface ActiveBuildsProps {
  // TODO: type a build
  builds: any[];
}

const ListItem = ({ fullName, status }: any) => {
  return (
    <Box className="build">
      <Box className={clsx("status-icon", { [status]: true })} />
      <Typography>{fullName}</Typography>
    </Box>
  );
};

export const ActiveBuilds = ({ builds }: ActiveBuildsProps) => {
  return (
    <StyledBox>
      <Box className="wrapper">
        {builds.map(build => (
          <ListItem key={build.id} {...build} />
        ))}
      </Box>
    </StyledBox>
  );
};
