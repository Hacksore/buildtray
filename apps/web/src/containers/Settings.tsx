import { Box, Button, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../main";
import DefaultLayout from "./DefaultLayout";

const Settings = () => {
  const handleSignout = () => {
    signOut(auth);
  };

  return (
    <Box>
      <Typography>Settings</Typography>

      <Button onClick={handleSignout} variant="contained" color="error">
        Sign out
      </Button>
    </Box>
  );
};

export default () => {
  return (
    <DefaultLayout>
      <Settings />
    </DefaultLayout>
  );
};
