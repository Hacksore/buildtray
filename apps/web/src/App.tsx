import { useAppDispatch } from "./hooks/redux";
import { getIdToken } from "firebase/auth";
import { useEffect } from "react";
import { appSlice } from "./reducers/authReducer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./main";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./containers/Dashboard";
import SignIn from "./containers/SignIn";
import { Tray } from "./containers/Tray";

const { setAuthToken } = appSlice.actions;

export default function App() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }

    const fetchUserAuth = async () => {
      if (user) {
        const jwt = await getIdToken(user);
        dispatch(setAuthToken(jwt));
        return navigate(location.pathname);
      }

      return navigate("/login");
    };

    fetchUserAuth();
  }, [user, loading]);

  return (
    <>
      <Routes>
        <Route path="/" element={<h2>Main landing page</h2>} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/tray" element={<Tray />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
