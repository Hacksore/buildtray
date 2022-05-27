import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        width: 400,
        height: 400,
        flexDirection: "column",
        margin: "0 auto",
        justifyContent: "center",
      }}
    >
      <Grid container alignItems="center" direction="row">
        <Grid item xs={12}>
          <Typography>This is the main home file</Typography>

          <Link to="login">Login</Link>
          <SignIn />
        </Grid>
      </Grid>
    </Box>
  );
}
