import { Box, Button, Grid, Typography } from "@mui/material";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { initialSignin } from "../api/user";
import { useAppDispatch } from "../hooks/redux";
import { auth } from "../main";

import { appSlice } from "../reducers/authReducer";
const { setGithubAccessToken } = appSlice.actions;

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    // if we have a token put it in the ducks
    if (credential && credential.accessToken) {
      dispatch(setGithubAccessToken(credential.accessToken));
      // post to the api with our gittoken
      initialSignin(credential.accessToken);

      // redirect to the dashboard
      navigate("/dashboard");
    }
  };

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
          <p>Login to view all the repos you have the app installed on</p>
        </Grid>
      </Grid>
    </Box>
  );
}
