import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import TodoApp from "./TodoApp";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TodoApp />
    </ThemeProvider>
  );
}

export default App;
