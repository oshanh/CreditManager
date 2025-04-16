import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import CustomerPage from "./pages/CustomerPage";
import CreditPage from "./pages/CreditPage";
import Login from "./pages/Login";
import { Container, Typography } from "@mui/material";
import WebSocketComponent from "./pages/WebSocketComponent";
import darkTheme from "./utils/Theme";



function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" sx={{ paddingBottom: 4 }}>
         
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<CustomerPage />} />
            <Route path="/credits/:customerId" element={<CreditPage />} />
            <Route path="/n" element={<WebSocketComponent />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
