import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../main";
import { Link } from "react-router-dom";
import { styled } from "@mui/material";

const StyledBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  // "& .header": {
  //   height: 40,
  // },
  // "& .toolbar": {
  //   height: 40,
  // },
  "& .header-link": {
    display: "flex",
    textDecoration: "none",
    fontWeight: "bold",
    marginLeft: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
  "& .header-logo": {
    marginRight: 6,
    width: 28,
    height: 28,
  },
  "& .menu-link": {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [user] = useAuthState(auth);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      disablePortal
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link className="menu-link" to="/dashboard">
          Dashboard
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link className="menu-link" to="/tray">
          Tray
        </Link>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <StyledBox>
      <AppBar elevation={0} className="header" classes={{ root: "header" }} position="fixed">
        <Toolbar disableGutters classes={{ root: "toolbar" }} >
          <Typography variant="h6" noWrap component="div">
            <Link className="header-link" to="/">
              <img className="header-logo" src="/icon.svg" alt="logo" />
              Buildtray
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Typography variant="h6" sx={{ mr: 1 }}>
                {user?.displayName}
              </Typography>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </StyledBox>
  );
}
