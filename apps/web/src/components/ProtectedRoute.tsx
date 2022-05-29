import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { AUTH_STATE } from "../types/loadingStates";
import { Box, CircularProgress, Grid } from "@mui/material";

interface ProtectedRouteProps {
  redirectPath: string;
  children: JSX.Element;
  skeleton?: JSX.Element;
}

const ProtectedRoute = ({ redirectPath = "/", children, skeleton }: ProtectedRouteProps) => {
  const authState = useAppSelector(state => state.main.authState);

  if (authState === AUTH_STATE.LOADING) {
    if (skeleton) {
      return skeleton;
    } else {
      return (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <CircularProgress />
        </Grid>
      );
    }
  }

  if (authState === AUTH_STATE.UNAUTHORIZED) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
