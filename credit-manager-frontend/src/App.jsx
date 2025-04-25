import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { CssBaseline, ThemeProvider, AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import CustomerPage from "./pages/CustomerPage";
import CreditPage from "./pages/CreditPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import Debtors from "./pages/Debtors";
import darkTheme from "./utils/Theme";
import Navbar from "./components/Navbar";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ paddingBottom: 4, marginTop: 4 }}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/debtors" element={<Debtors />} />
            </Route>
            <Route path="/credits/:customerId" element={<CreditPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
