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
      main: "#5A65EA",
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
  components: {
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: darkTheme.palette.background.default,
          "&::before": {
            // apply to the border of the arrow
            border: "1px solid #3a3a3a",
            backgroundColor: darken(darkTheme.palette.background.default, 0.2),
            boxSizing: "border-box",
          },
        },
        tooltip: {
          backgroundColor: darken(darkTheme.palette.background.default, 0.2),
          border: "1px solid #3a3a3a",
          fontSize: 20,
        },
      },
    },
  },
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
      main: "#717FCA",
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
  components: {
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: lightTheme.palette.background.default,
          "&::before": {
            // apply to the border of the arrow
            border: "1px solid #3a3a3a",
            backgroundColor: darken(lightTheme.palette.background.default, 0.2),
            boxSizing: "border-box",
          },
        },
        tooltip: {
          backgroundColor: darken(lightTheme.palette.background.default, 0.2),
          border: "1px solid #3a3a3a",
          fontSize: 20,
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
