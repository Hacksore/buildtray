import { Box, Button, Grid, styled, Typography } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../main";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  justifyContent: "center",

  "& .button": {
    textDecoration: "none",
  },
}));

export default function Home() {
  const [user] = useAuthState(auth);
  return (
    <StyledBox>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "60vh" }}
      >
        <Grid item xs={3}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4">Welcome to Buildtray 👋</Typography>
            <Typography variant="subtitle2">Buildtray allows you to subscribe to your github repo action status</Typography>
          </Box>
          {user ? (
            <Link className="button" to="/dashboard">
              <Button variant="contained">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link className="button" to="/login">
              <Button variant="contained">Sign in with Github</Button>
            </Link>
          )}
        </Grid>
      </Grid>
    </StyledBox>
  );
}
