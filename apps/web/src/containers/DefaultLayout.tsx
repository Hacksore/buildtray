import { Box } from "@mui/material";
import React from "react";
import TabBar from "../components/TabBar";

const DefaultLayout = ({ children, tabBar = true }: { children: React.ReactElement, tabBar?: boolean }) => {
  return (
    <Box sx={{ pt: 8, pb: 8,   height: "calc(100vh - 20px)"  }}>
      { tabBar && <TabBar /> }
      <Box sx={{ pl: 1, pr: 1 }}>{children}</Box>
    </Box>
  );
};

export default DefaultLayout;
