import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5722", // The main primary color
      light: "#ff8a50", // Light variant of the primary color
      dark: "#c41c00", // Dark variant of the primary color
      contrastText: "#fff", // Text color that ensures optimal readability on the primary color
    },
    secondary: {
      main: "#03a9f4", // The main secondary color
      light: "#67daff", // Light variant of the secondary color
      dark: "#007ac1", // Dark variant of the secondary color
      contrastText: "#000", // Text color that ensures optimal readability on the secondary color
    },
    //... you can define other color types (error, warning, info, success)
  },
});

export default theme;
