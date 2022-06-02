import { Box } from "@mui/material";
import React from "react";
import Footer from "../components/Footer";
import TabBar from "../components/TabBar";

const DefaultLayout = ({ children, tabBar = true }: { children: React.ReactElement; tabBar?: boolean }) => {
return (
  <Box sx={{ pt: 8, pb: 8, height: "calc(100vh)" }}>
    {tabBar && <TabBar />}
    <Box sx={{ pl: 3, pr: 3, pt: 3, pb: 10  }}>{children}</Box>
    <Footer />
  </Box>
);
};

export default DefaultLayout;
