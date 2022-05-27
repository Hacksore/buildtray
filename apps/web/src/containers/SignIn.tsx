import { useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { GithubAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { initialSignin } from "../api/user";
import { auth } from "../main";

export default function SignIn() {
  const navigate = useNavigate();
  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    const fuckYouReact = async () => {
      // connect to emulator on DEV
      // TODO: stick in env/config?
      // TODO: using local auth is nice but we can't test messing with the
      // github api
      if (import.meta.env.DEV) {
        // connectAuthEmulator(auth, "http://localhost:9099");
      }

      try {
        const result = await getRedirectResult(auth);

        if (!result) {
          return;
        }

        const credential = GithubAuthProvider.credentialFromResult(result);

        // if we have a token put it in the ducks
        if (credential && credential.accessToken) {
          await initialSignin({
            githubToken: credential.accessToken,
            // @ts-ignore
            firebaseToken: auth.currentUser.accessToken,
          });

          // redirect to the dashboard
          navigate("/dashboard");
        }
      } catch {
        // do nothing
      }
    };

    fuckYouReact();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Grid container alignItems="center" direction="row">
        <Grid item xs={12}>
          <Button className="sign-in" onClick={signInWithGithub}>
            Sign in with Github
          </Button>
          <Typography>Login to view all the repos you have the app installed on</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
