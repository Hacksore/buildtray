import { Box } from "@mui/material";
import { BuildsList } from "../components/BuildsList";

export const Tray = () => {
  return (
    <Box sx={{ mt: 10 }}>
      <BuildsList />
    </Box>
  );
};
