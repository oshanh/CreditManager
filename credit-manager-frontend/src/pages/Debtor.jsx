import React, { useState } from "react";
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

const Debtor = () => {
  const [viewOption, setViewOption] = useState("sideBySide"); // "sideBySide" or "combined"

  const debtor = {
    name: "John Doe",
    image: "https://via.placeholder.com/100", // Replace 
  };

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

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <>
      <CssBaseline />
      <Box sx={{ padding: 4 }}>
        {/* Debtor Info */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <Avatar
            src={debtor.image}
            alt="Debtor"
            sx={{ width: 100, height: 100, marginRight: 2 }}
          />
          <Typography variant="h4">{debtor.name}</Typography>
        </Box>

        {/* View Options */}
        <Box sx={{ marginBottom: 4 }}>
          <Button
            variant={viewOption === "sideBySide" ? "contained" : "outlined"}
            onClick={() => setViewOption("sideBySide")}
            sx={{ marginRight: 2 }}
          >
            Side by Side
          </Button>
          <Button
            variant={viewOption === "combined" ? "contained" : "outlined"}
            onClick={() => setViewOption("combined")}
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
