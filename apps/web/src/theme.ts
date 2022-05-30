import { darken, createTheme } from "@mui/material/styles";

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2C2F33",
      paper: "#2C2F33",
    },
    error: {
      main: "#db5151",
    },
    primary: {
      main: "#0c0c0c",
      contrastText: "#fff",
    },
    text: {
      primary: "#fff",
      disabled: "#c9c9c9",
    },
    secondary: {
      main: "#747474",
      contrastText: "#fff",
    },
    action: {
      disabled: "rgb(150, 150, 150)",
      disabledBackground: darken("#5A65EA", 0.2),
    },
  },
});

// overrides with access to the theme here
darkTheme = createTheme(darkTheme, {
  components: {},
});

let lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fff",
      paper: "#fff",
    },
    error: {
      main: "#db5151",
    },
    primary: {
      main: "#000",
      contrastText: "#fff",
    },
    text: {
      primary: "#000",
      disabled: "#000",
    },
    secondary: {
      main: "#747474",
      contrastText: "#fff",
    },
  },
});

// overrides with access to the theme here
lightTheme = createTheme(lightTheme, {
  components: {},
});

export { lightTheme, darkTheme };
