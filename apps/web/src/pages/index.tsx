/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Box, Button, CircularProgress, Grid, styled, Typography } from "@mui/material";

import { AUTH_STATE } from "../types/loadingStates";
import IconTwitter from "@mui/icons-material/Twitter";
import Link from "next/link";
import { useSelector } from "react-redux";

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
  const authState = useSelector((state: any) => state.main.authState);
  const buttonInfo =
    authState === AUTH_STATE.AUTHORIZED
      ? { text: "Go to Dashboard", path: "/dashboard" }
      : { text: "Sign in with Github ", path: "/login" };

  return (
    <StyledGrid container>
      <Grid item xs={12} md={5}>
        <Box className="heading">
          <Typography className="text" variant="h4">
            <span className="start">Build</span>
            <span className="end">tray</span>
          </Typography>
          <Typography className="subtitle" variant="subtitle2">
            Blazingly fast Github build statuses
          </Typography>
          <Typography className="caption" variant="subtitle1">
            With <strong>Buildtray</strong> you can subscribe to build events on Github repositories instead of relying
            on platforms like email, slack, and discord.
          </Typography>
        </Box>
        <Box>
          <Box sx={{ paddingTop: 1, paddingBottom: 3 }}>
            {authState === AUTH_STATE.LOADING ? (
              <Button disabled sx={{ width: 100, mr: 1 }}>
                <CircularProgress size={20} />
              </Button>
            ) : (
              <Link className="link" href={buttonInfo.path}>
                <Button variant="outlined" size="large" sx={{ mr: 1 }} className="button">
                  {buttonInfo.text}
                </Button>
              </Link>
            )}

            <Button
              size="large"
              sx={{ ml: 1 }}
              href="https://twitter.com/buildtray"
              target="_blank"
              className="button"
              startIcon={<IconTwitter />}
            >
              Share
            </Button>
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
        </Box>
      </Grid>
    </StyledGrid>
  );
}
