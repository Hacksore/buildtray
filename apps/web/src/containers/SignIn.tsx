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

export default function SignIn() {
  const navigate = useNavigate();

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
      if (!result) {
        return signInWithGithub();
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
  }, []);

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
