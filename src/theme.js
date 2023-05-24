import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // The main primary color
      light: "#64b5f6", // Light variant of the primary color
      dark: "#1976d2", // Dark variant of the primary color
      contrastText: "#fff", // Text color that ensures optimal readability on the primary color
    },
    secondary: {
      main: "#f50057", // The main secondary color
      light: "#ff4081", // Light variant of the secondary color
      dark: "#c51162", // Dark variant of the secondary color
      contrastText: "#fff", // Text color that ensures optimal readability on the secondary color
    },
    //... you can define other color types (error, warning, info, success)
  },
  typography: {
    fontSize: 20, // Set the default font size (in pixels)
  },
});

export default theme;
