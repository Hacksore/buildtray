import { Box, Button, Grid, Skeleton, styled, Typography } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { auth } from "../main";
import { AUTH_STATE } from "../types/loadingStates";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  justifyContent: "center",

  "& .button": {
    textDecoration: "none",
  },
}));

export default function Home() {
  const authState = useAppSelector(state => state.main.authState);

  const buttonActionText = authState === AUTH_STATE.AUTHORIZED ? "Go to Dashboard" : "Sign in with Github";
  const buttonRoute = authState === AUTH_STATE.AUTHORIZED ? "/dashboard" : "/login";
  return (
    <StyledBox>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "60vh" }}
      >
        <Grid item xs={3}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4">Welcome to Buildtray 👋</Typography>
            <Typography variant="subtitle2">
              Buildtray allows you to subscribe to your github repo action status
            </Typography>
          </Box>
          {authState === AUTH_STATE.LOADING ? (
            <Skeleton width={188} height={58} />
          ) : (
            <Link className="button" to={buttonRoute}>
              <Button variant="contained" style={{ textTransform: "none" }}>
                {buttonActionText}
              </Button>
            </Link>
          )}
        </Grid>
      </Grid>
    </StyledBox>
  );
}
