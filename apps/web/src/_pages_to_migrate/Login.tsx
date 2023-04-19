import { Box, CircularProgress } from "@mui/material";

export default function Login() {
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        pt: 10,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
