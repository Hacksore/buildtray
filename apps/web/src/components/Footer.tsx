import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", pt: 2, pb: 2 }}>
      <Typography>
        Follow on{" "}
        <a style={{ fontWeight: "bold", color: "#8AB4F7" }} target="_blank" href="https://twitter.com/buildtray">
          @buildtray
        </a>{" "}
        on Twitter for updates
      </Typography>
    </Box>
  );
};

export default Footer;
