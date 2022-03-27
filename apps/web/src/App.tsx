import { useAppDispatch } from "./hooks/redux";
import { getIdToken } from "firebase/auth";
import { useEffect } from "react";
import { appSlice } from "./reducers/authReducer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./main";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./containers/Dashboard";
import SignIn from "./containers/SignIn";

const { setAuthToken } = appSlice.actions;

export default function App() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }

    const fetchUserAuth = async () => {
      if (user) {
        const jwt = await getIdToken(user);
        dispatch(setAuthToken(jwt));
        return navigate("/dashboard");
      }

      return navigate("/login");
    };

    fetchUserAuth();
  }, [user, loading]);

  return (
    <Routes>
      <Route path="/" element={<h2>Main landing page</h2>} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
