import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BuildsList } from "../components/BuildsList";
import { buildSlice } from "../reducers/buildReducer";
import DefaultLayout from "./DefaultLayout";

const { clearBuilds } = buildSlice.actions;

const Tray = () => {
  const [hasNotification, setHasNotification] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    requestNotificationPerms();

    return () => {
      dispatch(clearBuilds());
    };
  }, []);

  const requestNotificationPerms = () => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("No notification support");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      setHasNotification(true);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          setHasNotification(true);
        }
      });
    }
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2">This page will show you running and recent builds</Typography>
      {!hasNotification && <Typography>You need to allow permissions to receive notifications</Typography>}
      <BuildsList />
    </Box>
  );
};

export default () => {
  return (
    <DefaultLayout>
      <Tray />
    </DefaultLayout>
  );
};
