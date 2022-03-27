import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { getIdToken } from "firebase/auth";
import { useEffect } from "react";
import { appSlice } from "../reducers/rootReducer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./_app";
import { useRouter } from "next/router";

const { setAuthToken } = appSlice.actions;

export default function App() {
  const router = useRouter();

  const [user] = useAuthState(auth);
  const authToken = useAppSelector(state => state.root.authToken);
  const dispatch = useAppDispatch();

  // figure out if the user is authed then set token and redirect to dashboard
  // otherwwie route to signin page
  useEffect(() => {
    const fetchJwt = async () => {
      if (authToken || !user) {
        return;
      }

      const jwt = await getIdToken(user);
      dispatch(setAuthToken(jwt));

      // send to dashboard
      router.push("/dashboard");
    };
    fetchJwt();
  }, [authToken, user]);

  return <div>need to auth user</div>;
}
