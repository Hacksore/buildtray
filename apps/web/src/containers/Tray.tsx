import { Box, Typography } from "@mui/material";
import { BuildsList } from "../components/BuildsList";

export const Tray = () => {
  return (
    <Box sx={{ p: 1, mt: 8 }}>
      <Typography variant="body2">This page will show you running and recent builds</Typography>
      <BuildsList />
    </Box>
  );
};
