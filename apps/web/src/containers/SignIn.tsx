import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { initialSignin } from "../api/user";
import { auth } from "../main";
import { useAppSelector } from "../hooks/redux";
import { AUTH_STATE } from "../types/loadingStates";

export default function SignIn() {
  const navigate = useNavigate();
  const authState = useAppSelector(state => state.main.authState);

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const handleAuthFlow = async () => {
    try {

      // enabled persistance
      await setPersistence(auth, browserLocalPersistence);
      const result = await getRedirectResult(auth);

      // we did not get a result so we should sign in :)
      if (authState === AUTH_STATE.UNAUTHORIZED) {
        console.log("User is either UNAUTHORIZED or the redirect did not have a user");
        return signInWithGithub();
      }

      if (!result) {
        console.log("Something went wrong with the login");
        return navigate("/");
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleAuthFlow();
  }, [authState]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        pt: 10,
      }}
    >
      <Typography>Please wait while we log you in</Typography>
      <CircularProgress />
    </Box>
  );
}
