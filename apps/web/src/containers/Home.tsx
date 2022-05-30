import { Box, Button, Grid, Skeleton, styled, Typography } from "@mui/material";
import DefaultLayout from "./DefaultLayout";

import IconGithub from "@mui/icons-material/GitHub";
import { useAppSelector } from "../hooks/redux";
import { AUTH_STATE } from "../types/loadingStates";
import { Link } from "react-router-dom";

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  alignItems: "center",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  

  "& .text": {
    fontWeight: "bold",
    fontSize: 80,
    paddingTop: 40,
    color: "#1c1c1c",
  },

  "& .start": {
    color: "red",
    backgroundColor: "#f3ec78",
    backgroundImage: "linear-gradient(45deg, #d63e3e, orange)",
    backgroundSize: "100%",
    WebkitBackgroundClip: "text",
    MozBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    MozTextFillColor: "transparent",
  },

  "& .end": {
    color: "green",
    backgroundColor: "#f3ec78",
    backgroundImage: "linear-gradient(45deg, orange, green)",
    backgroundSize: "100%",
    WebkitBackgroundClip: "text",
    MozBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    MozTextFillColor: "transparent",
  },

  "& .subtitle": {
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: "bold",
  },

  "& .caption": {
    paddingTop: 10,
    maxWidth: 800,
  },

  "& .heading": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },

  "& .link": {
    textDecoration: "none",
    padding: 2,
  },

  "& .button": {
    textTransform: "none",
    textDecoration: "none",
    fontWeight: "bold",
  },

  "& .platform": {
    width: 60,
    paddingLeft: 8,
    paddingRight: 8,
  },
}));

export default function Home() {
  const authState = useAppSelector(state => state.main.authState);
  const buttonInfo =
    authState === AUTH_STATE.AUTHORIZED
      ? { text: "Go to Dashboard", path: "/dashboard" }
      : { text: "Sign in with Github ", path: "/login" };

  return (
    <DefaultLayout tabBar={false}>
      <StyledGrid container lg={12}>
        <Grid item>
          <Grid className="heading">
            <Typography className="text" variant="h4">
              <span className="start">Build</span>
              <span className="end">tray</span>
            </Typography>
            <Typography className="subtitle" variant="subtitle2">
              Blazingly fast Github build statuses
            </Typography>
            <Typography className="caption" variant="subtitle1">
              With <strong>Buildtray</strong> you can subscribe to build events on Github repositories instead of
              relying on platforms like email, slack, and discord.
            </Typography>
            <Typography className="caption" variant="subtitle1">
              We are aiming to support many different platforms such as web, desktop, and editors to be able to give you
              notifications and build status where you need them most.
            </Typography>
          </Grid>
          <Grid>
            <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
              {authState === AUTH_STATE.LOADING ? (
                <Skeleton width={188} height={58} />
              ) : (
                <Link className="link" to={buttonInfo.path}>
                  <Button variant="outlined" size="large" className="button">
                    {buttonInfo.text}
                  </Button>
                </Link>
              )}

              <Button size="large" href="https://github.com/Hacksore/buildtray" target="_blank" className="button">
                Source Code
              </Button>
            </Box>

            <Box sx={{ padding: 2 }}>
              {/* <img style={{ maxWidth: 500 }} src="/marketing.png" /> */}
            </Box>

            <Box sx={{ padding: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Coming soon to
              </Typography>
              <img className="platform" src="/img/platform/chrome.svg" />
              <img className="platform" src="/img/platform/apple.svg" />
              <img className="platform" src="/img/platform/tux.svg" />
              <img className="platform" src="/img/platform/windows.svg" />
              <img className="platform" src="/img/platform/vscode.svg" />
              <img className="platform" src="/img/platform/vim.svg" />
            </Box>
          </Grid>
        </Grid>
      </StyledGrid>
    </DefaultLayout>
  );
}
