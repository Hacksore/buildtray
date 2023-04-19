import { Box, Button, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { withDefaultLayout } from "./DefaultLayout";

export default function Settings() {
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