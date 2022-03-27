import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../main";

export default function AuthProvider({ children }: { children: React.ReactNode }) {

  const handleLogin = (newUser: string, callback: VoidFunction) => {
    const provider = new GithubAuthProvider();
    provider.addScope("read:user");
    signInWithPopup(auth, provider);
  };


  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
