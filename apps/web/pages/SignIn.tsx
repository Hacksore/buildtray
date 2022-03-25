
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./_app";

export default function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GithubAuthProvider();
    provider.addScope("read:user");
    signInWithPopup(auth, provider);
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
