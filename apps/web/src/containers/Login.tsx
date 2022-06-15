import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
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
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { appSlice } from "../reducers/mainSlice";
import { AUTH_STATE } from "../types/loadingStates";

const { setAuthState } = appSlice.actions;


export default function Login() {
  const navigate = useNavigate();
  const authState = useAppSelector(state => state.main.authState);
  const dispatch = useAppDispatch();

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();

    // set persisintance to loacal storage
    await setPersistence(auth, browserLocalPersistence);
    signInWithRedirect(auth, provider);
  };

  const handleAuthFlow = async () => {
    try {
      // enabled persistance
      const result = await getRedirectResult(auth);
      console.log("RESULT FROM SIGNIN", result, authState);

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
        dispatch(setAuthState(AUTH_STATE.AUTHORIZED));
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
      <CircularProgress />
    </Box>
  );
}
