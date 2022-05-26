import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Grid container alignItems="center" direction="row">
        <Grid item xs={12}>
          <Typography>This is the main home file</Typography>

          <Link to="login">Login</Link>
        </Grid>
      </Grid>
    </Box>
  );
}
