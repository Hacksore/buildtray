import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useAppDispatch } from "../hooks/redux";
import { auth } from "../main";

import { appSlice } from "../reducers/authReducer";
const { setGithubAccessToken } = appSlice.actions;

export default function SignIn() {
  const dispatch = useAppDispatch();

  const signInWithGoogle = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);

    console.log(credential, result);
    // if we have a token put it in the ducks
    if (credential && credential.accessToken) {
      dispatch(setGithubAccessToken(credential.accessToken));
    }
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Github
      </button>
      <p>Login to view all the repos you have the app installed on</p>
    </>
  );
}
