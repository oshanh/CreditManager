import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { CssBaseline, ThemeProvider, Container } from "@mui/material";
import CustomerPage from "./pages/CustomerPage";
import CreditPage from "./pages/CreditPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import Debtors from "./pages/Debtors";
import darkTheme from "./utils/Theme";
import Navbar from "./components/Navbar";
import Debtor from "./pages/Debtor";
import CreateAccount from "./pages/CreateAccount";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Welcome page without navbar */}
          <Route path="/" element={<Welcome />} />
          
          
          {/* Routes with navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Container maxWidth="lg" sx={{ paddingBottom: 4, marginTop: 4 }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/create-account" element={<CreateAccount />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/debtors" element={<Debtors />} />
                  <Route path="/debtor/:debtorId" element={<Debtor />} />
                  <Route path="/credits/:customerId" element={<CreditPage />} />
                  <Route path="/customer" element={<CustomerPage />} />
                </Routes>
              </Container>
            </>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
