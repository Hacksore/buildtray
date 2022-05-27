import { Box, Paper } from "@mui/material";
import React from "react";
import TabBar from "../components/TabBar";

const DefaultLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <Box sx={{ pt: 8 }}>
      <TabBar />
      <Paper>{children}</Paper>
    </Box>
  );
};

export default DefaultLayout;
