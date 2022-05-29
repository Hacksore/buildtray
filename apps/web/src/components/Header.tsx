import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../main";
import { Link } from "react-router-dom";
import { Button, Skeleton, styled } from "@mui/material";
import { AUTH_STATE } from "../types/loadingStates";
import { useAppSelector } from "../hooks/redux";

const StyledBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
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
}));

const UserButton = ({ state, user }: { state: AUTH_STATE; user: any }) => {
  if (state === AUTH_STATE.AUTHED) {
    return (
      <Link className="header-link" to="/dashboard">
        <Button style={{ textTransform: "none" }} size="small" color="inherit">
          <Typography variant="h6" sx={{ mr: 1 }}>
            {user?.displayName}
          </Typography>
          <AccountCircle />
        </Button>
      </Link>
    );
  }

  if (state === AUTH_STATE.DEAUTHED) {
    return (
      <Link className="header-link" to="/login">
        <Button style={{ textTransform: "none" }} size="small" color="inherit">
          <Typography variant="h6" sx={{ mr: 1 }}>
            Sign in with Github
          </Typography>
        </Button>
      </Link>
    );
  }

  if (state === AUTH_STATE.LOADING) {
    return <Skeleton width={140} height={40} />;
  }

  return null;
};

export default function Header() {
  const [user] = useAuthState(auth);
  const authState = useAppSelector(state => state.main.authState);

  return (
    <StyledBox>
      <AppBar elevation={0} className="header" classes={{ root: "header" }} position="fixed">
        <Toolbar disableGutters classes={{ root: "toolbar" }}>
          <Typography variant="h6" noWrap component="div">
            <Link className="header-link" to="/">
              <img className="header-logo" src="/logo.svg" alt="logo" />
              Buildtray
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
            <UserButton user={user} state={authState} />
          </Box>
        </Toolbar>
      </AppBar>
    </StyledBox>
  );
}
