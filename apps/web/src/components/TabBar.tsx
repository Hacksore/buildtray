import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabIndexFromPath: any = {
  "/dashboard": 0,
  "/dashboard/settings": 1,
  "/dashboard/browse": 2,
};

const StyledLink = styled(Link)(() => ({
  textDecoration: "none",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: "bold",
}));

export default function TabBar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndexFromPath[path]} aria-label="dashboard tabs">
          <StyledLink to="/dashboard">
            <StyledTab label="Repositories" {...a11yProps(0)} />
          </StyledLink>
          <StyledLink to="/dashboard/settings">
            <StyledTab label="Settings" {...a11yProps(1)} />
          </StyledLink>
          <StyledLink to="/dashboard/browse">
            <StyledTab label="Browse" {...a11yProps(2)} />
          </StyledLink>
        </Tabs>
      </Box>
    </Box>
  );
}
