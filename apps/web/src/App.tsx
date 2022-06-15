import { Box } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./containers/Dashboard";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Builds from "./containers/Builds";
import { auth } from "./main";
import { AUTH_STATE } from "./types/loadingStates";

import { appSlice } from "./reducers/mainSlice";
import Settings from "./containers/Settings";
import Browse from "./containers/Browse";
import { onAuthStateChanged, User } from "firebase/auth";
import { useAppSelector } from "./hooks/redux";
import IBuildInfo from "shared/types/IBuildInfo";
import { useQuery } from "react-query";
import { getSubscribedRepos, getUserInfo } from "./api/user";
const { setAuthState } = appSlice.actions;

import firebaseService from "service/firebase";
import { buildSlice } from "./reducers/buildReducer";

const { addBuild, updateBuild } = buildSlice.actions;

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useAppSelector(state => state.main.authState);

  // get builds if they are logged in
  const { data: subscribedRepos } = useQuery("subscribedRepos", getSubscribedRepos, {
    initialData: [],
    enabled: authState === AUTH_STATE.AUTHORIZED,
  });

  // watch for repo builds i've subbed to
  useEffect(() => {
    if (!subscribedRepos || subscribedRepos.length === 0) return;

    // get all repos I have subbed to
    subscribedRepos.forEach(async (repo: IBuildInfo) => {
      // get recent builds
      console.log("Subscribed to", repo.fullName);
      const recentBuilds: IBuildInfo[] = await firebaseService.getMostRecentBuilds(repo.fullName);
      for (const build of recentBuilds) {
        dispatch(addBuild(build));
      }

      // sub for builds events
      firebaseService.subscribeToRepo(repo.fullName);
    });

    // listen for events
    firebaseService.on("build", (build: IBuildInfo) => {
      // getting builds now let's send to redux
      if (build.status === "queued") {
        dispatch(addBuild(build));
      } else if (build.status === "completed" || build.status === "failure") {
        dispatch(updateBuild(build));
      }

      // spawn notification
      const status = {
        icon: "🟠",
        text: "started",
      };

      if (build.conclusion === "success") {
        status.icon = "🟢";
        status.text = "completed";
      }
      if (build.conclusion === "failure") {
        status.icon = "🔴";
        status.text = "failed";
      }

      const title = `${status.icon} ${build.fullName} build ${status.text}`;
      const body = `@${build.user.sender} - ${build.commit.message}`;
      const notification = new Notification(title, { body, icon: "/logo.svg" });
      notification.onclick = function (event) {
        event.preventDefault();
        window.open(build.url, "_blank");
      };
    });

    return () => firebaseService.clearAllListeners();
  }, [subscribedRepos]);

  const handleAuthStateChange = async (user: User | null) => {
    // dont eval whe nwe are on the login page as we need to wait
    console.log("Data", location, authState, user);
    const userinfo = await getUserInfo();
 
    // backend had a session for us so we are authed!
    if (userinfo.error) {
      dispatch(setAuthState(AUTH_STATE.UNAUTHORIZED));
    } else {
      dispatch(setAuthState(AUTH_STATE.AUTHORIZED));
    }
  };

  useEffect(() => {
    // sub to auth state changes from firebase
    // NOTE: this only implies locally that we are doing state changes
    onAuthStateChanged(auth, handleAuthStateChange);
  }, []);

  return (
    <Box style={{ overflowY: "auto", height: "calc(100vh-20px)" }}>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />
        <Route
          path="/builds"
          element={
            <ProtectedRoute redirectPath="/">
              <Builds />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute redirectPath="/">
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute redirectPath="/">
              <Browse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute redirectPath="/">
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}
