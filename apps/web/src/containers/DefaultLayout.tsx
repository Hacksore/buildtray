import { Box } from "@mui/material";
import React from "react";
import TabBar from "../components/TabBar";

const DefaultLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <Box sx={{ pt: 8 }}>
      <TabBar />
      <Box sx={{ pl: 1, pr: 1 }}>{children}</Box>
    </Box>
  );
};

export default DefaultLayout;
