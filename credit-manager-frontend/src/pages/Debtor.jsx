import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Grid2,
  IconButton,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import customerService from "../services/customerService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Debtor = () => {
  const getCustomer = customerService.getCustomerById;
  const [viewOption, setViewOption] = useState("combined"); // "sideBySide" or "combined"
  const [debtor, setDebtor] = useState({});

  const location = useLocation();
  const { debtorId } = location.state || {}; // Get the debtorId from the state passed via Link
  console.log("Debtor ID:", debtorId);

  // Fetch debtor data based on debtorId
  // This is a placeholder. Replace with actual API call to fetch debtor data.
   const fetchDebtorData = async () => {
    try {
      const response = await getCustomer(debtorId);
      setDebtor(response);
      console.log("Debtor data:", response);
      // Set the debtor data in state if needed
    } catch (error) {
      console.error("Error fetching debtor data:", error);
    }
  };
  // Call the function to fetch debtor data
  useEffect(() => {
    fetchDebtorData();
  }, [debtorId]);
 

  const transactions = [
    { type: "credit", date: "2023-10-01 10:00", description: "Salary", amount: 1000 },
    { type: "debit", date: "2023-10-02 12:00", description: "Groceries", amount: 200 },
    { type: "credit", date: "2023-10-03 14:00", description: "Freelance Work", amount: 500 },
    { type: "debit", date: "2023-10-04 16:00", description: "Rent", amount: 800 },
    { type: "credit", date: "2023-10-01 10:00", description: "Salary", amount: 1000 },
    { type: "debit", date: "2023-10-02 12:00", description: "Groceries", amount: 200 },
    { type: "credit", date: "2023-10-03 14:00", description: "Freelance Work", amount: 500 },
    { type: "credit", date: "2023-10-04 16:00", description: "Rent", amount: 800 },
    { type: "credit", date: "2023-10-03 14:00", description: "Freelance Work", amount: 500 },
    { type: "credit", date: "2023-10-04 16:00", description: "Rent", amount: 800 },
    { type: "credit", date: "2023-10-03 14:00", description: "Freelance Work", amount: 500 },
    { type: "credit", date: "2023-10-04 16:00", description: "Rent", amount: 800 },
    { type: "debit", date: "2023-10-05 18:00", description: "Utilities", amount: 150 },
    { type: "debit", date: "2023-10-06 20:00", description: "Dining Out", amount: 75 },
    { type: "debit", date: "2023-10-07 08:00", description: "Transportation", amount: 50 },
  ];

  const totalBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === "credit"
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  const totalDebit = transactions
    .filter((transaction) => transaction.type === "debit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalCredit = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <>
      <CssBaseline />
      <Box sx={{ padding: 4 }}>
        {/* Debtor Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 6,
              background: (theme) => theme.palette.grey[900],
              borderRadius: 4,
              boxShadow: 3,
              py: 4,
              px: { xs: 2, md: 6 },
              maxWidth: 700,
              mx: "auto",
              gap: { xs: 3, md: 6 },
            }}
          >
            <Avatar
              src={debtor.profilePhotoPath ? `${API_BASE_URL}${debtor.profilePhotoPath}` : ""}
              alt="Debtor"
              sx={{
                width: 140,
                height: 140,
                border: "4px solid",
                borderColor: "primary.dark",
                boxShadow: 2,
                mr: { md: 4 },
                mb: { xs: 2, md: 0 },
                bgcolor: "grey.800",
              }}
            />
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h3"
                sx={{
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            fontWeight: 700,
            color: "primary.dark", // changed from light to dark blue
            mb: 1,
            letterSpacing: 1,
            fontSize: { xs: "2rem", md: "2.5rem" },
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                }}
              >
                {debtor.customerName}
              </Typography>
              <Typography
                variant="h6"
                sx={{
            fontFamily: "'Fira Mono', 'Roboto Mono', monospace",
            color: "grey.400",
            mb: 1,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                {debtor.contactNumber}
              </Typography>
              <Typography
                variant="body1"
                sx={{
            fontFamily: "'Roboto', sans-serif",
            color: "grey.500",
            fontSize: { xs: "1rem", md: "1.1rem" },
            wordBreak: "break-word",
                }}
              >
                {debtor.address}
              </Typography>
            </Box>
            
          </Box>

          {/* Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginBottom: 1,
              background: (theme) => theme.palette.grey[900],
              borderRadius: 4,
              boxShadow: 3,
              py: 2,
              px: 4,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            fontWeight: 700,
            color: "primary.dark",
            mb: 1,
            letterSpacing: 1,
                }}
              >
                Total Credit
              </Typography>
              <Typography
                variant="h5"
                sx={{
            fontFamily: "'Fira Mono', 'Roboto Mono', monospace",
            color: "grey.400",
            mb: 1,
            fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Rs.{totalCredit}
              </Typography>
              <Typography
                variant="body1"
                sx={{
            fontFamily: "'Roboto', sans-serif",
            color: "grey.500",
            fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Total amount owed
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            fontWeight: 700,
            color: "primary.dark",
            mb: 1,
            letterSpacing: 1,
                }}
              >
                Total Debit
              </Typography>
              <Typography
                variant="h5"
                sx={{
            fontFamily: "'Fira Mono', 'Roboto Mono', monospace",
            color: "grey.400",
            mb: 1,
            fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Rs.{totalDebit}
              </Typography>
              <Typography
                variant="body1"
                sx={{
            fontFamily: "'Roboto', sans-serif",
            color: "grey.500",
            fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Total amount paid
              </Typography>
            </Box>
            
          </Box>   
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
                background: (theme) => theme.palette.grey[900],
              borderRadius: 4,
              boxShadow: 3,
              py: 2,
              px: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "error.main",
                  fontFamily: "'Montserrat', 'Roboto', sans-serif",
                  letterSpacing: 1,
                }}
              >
                Total Balance: Rs.{totalBalance}
              </Typography>
            </Box>


          {/* View Options */}
          <Box sx={{ marginBottom: 4, textAlign: "center" }}>
            <Button
              variant={viewOption === "sideBySide" ? "contained" : "outlined"}
              onClick={() => setViewOption("sideBySide")}
              sx={{
                marginRight: 2,
                bgcolor: viewOption === "sideBySide" ? "primary.dark" : "grey.800",
                color: "grey.100",
                borderColor: "primary.dark",
                "&:hover": {
            bgcolor: "primary.main",
                },
              }}
            >
              Side by Side
            </Button>
            <Button
              variant={viewOption === "combined" ? "contained" : "outlined"}
              onClick={() => setViewOption("combined")}
              sx={{
                bgcolor: viewOption === "combined" ? "primary.dark" : "grey.800",
                color: "grey.100",
                borderColor: "primary.dark",
                "&:hover": {
            bgcolor: "primary.main",
                },
              }}
            >
              Combined
            </Button>
          </Box>

          {/* Transactions */}
        {viewOption === "sideBySide" ? (
          <Grid2 container spacing={2}>
            {/* Credits */}
            <Grid2 xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Credits
              </Typography>
              <TableContainer sx={{ marginBottom: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedTransactions
                      .filter((t) => t.type === "credit")
                      .map((t, index) => (
                        <TableRow key={index}>
                          <TableCell>{t.date}</TableCell>
                          <TableCell>{t.description}</TableCell>
                          <TableCell>${t.amount}</TableCell>
                          <TableCell>
                            <IconButton>
                              <CheckCircle color="success" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>

            {/* Debits */}
            <Grid2 xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Debits
              </Typography>
              <TableContainer sx={{ marginBottom: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedTransactions
                      .filter((t) => t.type === "debit")
                      .map((t, index) => (
                        <TableRow key={index}>
                          <TableCell>{t.date}</TableCell>
                          <TableCell>{t.description}</TableCell>
                          <TableCell>${t.amount}</TableCell>
                          <TableCell>
                            <IconButton>
                              <Cancel color="error" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>
          </Grid2>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              All Transactions
            </Typography>
            <TableContainer sx={{ marginBottom: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTransactions.map((t, index) => (
                    <TableRow key={index}>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>${t.amount}</TableCell>
                      <TableCell>
                        <IconButton>
                          {t.type === "credit" ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="error" />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Debtor;
