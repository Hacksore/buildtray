import { Box, Button, Grid, Typography } from "@mui/material";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { initialSignin } from "../api/user";
import { auth } from "../main";

export default function SignIn() {
  const navigate = useNavigate();

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    // if we have a token put it in the ducks
    if (credential && credential.accessToken) {

      // login to the api so we create a session
      // TODO: move both github and firebase token to server?
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
          <Typography>Login to view all the repos you have the app installed on</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
