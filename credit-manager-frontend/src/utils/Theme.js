import { createTheme } from "@mui/material";


// Create a Dark Theme
const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9", // Light blue for primary color
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#aaaaaa",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
    components: {
      // You can also customize some components to fit the theme better
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none", // Prevent uppercase text for buttons
          },
        },
      },
    },
  });

  export default darkTheme;