import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./containers/Dashboard";
import Home from "./containers/Home";
import SignIn from "./containers/SignIn";
import Tray from "./containers/builds";
import { auth } from "./main";
import { AUTH_STATE } from "./types/loadingStates";

import { appSlice } from "./reducers/mainSlice";
import Settings from "./containers/Settings";
import Browse from "./containers/Browse";
import { onAuthStateChanged, User } from "firebase/auth";
const { setAuthState } = appSlice.actions;

export default function App() {
  const dispatch = useDispatch();

  const handleAuthStateChange = (user: User | null) => {
    if (user) {
      dispatch(setAuthState(AUTH_STATE.AUTHORIZED));
    } else {
      dispatch(setAuthState(AUTH_STATE.UNAUTHORIZED));
    }
  };

  useEffect(() => {
    dispatch(setAuthState(AUTH_STATE.LOADING));

    onAuthStateChanged(auth, handleAuthStateChange);
  }, []);

  return (
    <Box style={{ overflowY: "auto", height: "calc(100vh-20px)" }}>
      <Header />
      <Routes>
        <Route path="/login" element={<SignIn />} />

        <Route path="/" element={<Home />} />
        <Route
          path="/builds"
          element={
            <ProtectedRoute redirectPath="/">
              <Tray />
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
