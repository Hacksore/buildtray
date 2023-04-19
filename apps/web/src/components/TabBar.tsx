import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material";
import Link from "next/link";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface ITabItem {
  index: number;
  name: string;
}
interface ITabRecord {
  [name: string]: ITabItem;
}

const tabList: ITabRecord = {
  "/dashboard": {
    index: 0,
    name: "Repositories",
  },
  "/builds": {
    index: 1,
    name: "Builds",
  },
  "/browse": {
    index: 2,
    name: "Browse",
  },
  "/settings": {
    index: 3,
    name: "Settings",
  },
};

const StyledLink = styled(Link)(() => ({
  textDecoration: "none",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: "bold",
}));

export default function TabBar() {
  const path = location.pathname;

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tabList[path].index}>
        {Object.entries(tabList).map(([path, item]: [string, ITabItem]) => (
          <StyledLink key={path} to={path}>
            <StyledTab label={item.name} {...a11yProps(0)} />
          </StyledLink>
        ))}
      </Tabs>
    </Box>
  );
}
