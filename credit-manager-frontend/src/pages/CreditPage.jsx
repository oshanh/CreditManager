import React, { useState, useEffect } from "react";
import creditService from "../services/creditService";
import repaymentService from "../services/repaymentService";
import { useParams,useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  Alert
} from "@mui/material";
import { Delete, Edit, Send } from "@mui/icons-material";
import WebSocketComponent from "./WebSocketComponent";

function CreditPage() {
  const { customerId } = useParams();
  const location = useLocation();
  const { customerName } = location.state || {}; 
  const [credits, setCredits] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [selectedCreditId, setSelectedCreditId] = useState(null);
  const [openCreditDialog, setOpenCreditDialog] = useState(false);
  const [openRepaymentDialog, setOpenRepaymentDialog] = useState(false);
  const [creditForm, setCreditForm] = useState({ creditAmount: "", description: "", dueDate: "" });
  const [repaymentForm, setRepaymentForm] = useState({ repaymentAmount: "", repaymentDate: "" });

  // Fetch Credits
  useEffect(() => {
    creditService.getAllCredits()
      .then((data) => setCredits(data.filter(credit => credit.customerId === parseInt(customerId))))
      .catch((err) => console.error("Error fetching credits:", err));
  }, [customerId]);

  // Fetch Repayments when a credit is selected
  useEffect(() => {
    if (selectedCreditId) {
      repaymentService.getRepaymentsForCredit(selectedCreditId)
        .then((data) => setRepayments(data))
        .catch((err) => console.error("Error fetching repayments:", err));
    }
  }, [selectedCreditId]);

  // Open and close dialogs
  const handleOpenCreditDialog = (credit = null) => {
    setCreditForm(
      credit
        ? { ...credit }  // Edit existing credit
        : { creditAmount: "", description: "", dueDate: "", customerId: customerId } // Reset for new credit
    );
    setOpenCreditDialog(true);
  };

  const handleOpenRepaymentDialog = (repayment = null) => {
    setRepaymentForm(repayment ? repayment : { repaymentAmount: "", repaymentDate: "" });
    setOpenRepaymentDialog(true);
  };

  const handleClose = () => {
    setOpenCreditDialog(false);
    setOpenRepaymentDialog(false);
  };

  // Handle input change
  const handleChange = (e, type) => {
    const { name, value } = e.target;
    type === "credit"
      ? setCreditForm({ ...creditForm, [name]: value })
      : setRepaymentForm({ ...repaymentForm, [name]: value });
  };

  // Create or Update Credit
  const handleSubmitCredit = () => {
    if (creditForm.id) {
      creditService.updateCredit(creditForm.id, creditForm).then(() => {
        setCredits(credits.map((c) => (c.id === creditForm.id ? creditForm : c)));
      });
    } else {
      creditService.createCredit({ ...creditForm, customerId }).then((newCredit) => {
        setCredits([...credits, newCredit]);
      });
    }
    handleClose();
  };

  // Create or Update Repayment
  const handleSubmitRepayment = () => {
    if (repaymentForm.id) {
      repaymentService.updateRepayment(repaymentForm.id, repaymentForm).then(() => {
        setRepayments(repayments.map((r) => (r.id === repaymentForm.id ? repaymentForm : r)));
      });
    } else {
      repaymentService.createRepayment(selectedCreditId, repaymentForm).then((newRepayment) => {
        setRepayments([...repayments, newRepayment]);
      });
    }
    handleClose();
  };

  // Delete Credit
  const handleDeleteCredit = (id) => {
    creditService.deleteCredit(id).then(() => {
      setCredits(credits.filter((credit) => credit.id !== id));
      if (selectedCreditId === id) setSelectedCreditId(null);
    });
  };

  // Delete Repayment
  const handleDeleteRepayment = (id) => {
    repaymentService.deleteRepayment(id).then(() => {
      setRepayments(repayments.filter((repayment) => repayment.id !== id));
    });
  };

   // Send WhatsApp notification
   const handleSendWhatsApp = (credit) => {
    creditService
      .sendWhatsAppNotification(credit.customerId, credit.id) // Pass the customerId and creditId
      .then((response) => {
        alert("WhatsApp notification sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending WhatsApp notification:", err);
        alert("Failed to send WhatsApp notification.");
      });
  };

  return (
    <Container>
      <WebSocketComponent />
      
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>Credits for Customer : {customerName}</Typography>
      
      {/* Add Credit Button */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpenCreditDialog()}>
          Add Credit
        </Button>
      </Box>

      {/* Grid for Credits and Repayments */}
      <Grid container spacing={4} justifyContent="center">
        {/* Left column for Credits */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" textAlign="center">Credits</Typography>
          <TableContainer component={Paper} sx={{ mb: 4, minWidth: 300 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {credits.map((credit) => (
                  <TableRow key={credit.id} onClick={() => setSelectedCreditId(credit.id)} sx={{ cursor: "pointer" }}>
                    <TableCell>{credit.description}</TableCell>
                    <TableCell>${credit.creditAmount}</TableCell>
                    <TableCell>{credit.dueDate}</TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => handleSendWhatsApp(credit)}>
                        <Send />
                      </Button>
                      <Button color="primary" onClick={(e) => { e.stopPropagation(); handleOpenCreditDialog(credit); }}>
                        <Edit />
                      </Button>
                      <Button color="error" onClick={(e) => { e.stopPropagation(); handleDeleteCredit(credit.id); }}>
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right column for Repayments */}
        <Grid item xs={12} md={6}>
          {selectedCreditId && (
            <Box mt={4}>
              <Typography variant="h5" textAlign="center">Repayments</Typography>
              <Box display="flex" justifyContent="center" mb={2}>
                <Button variant="contained" color="secondary" onClick={() => handleOpenRepaymentDialog()}>
                  Add Repayment
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ minWidth: 300 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Repayment Amount</TableCell>
                      <TableCell>Repayment Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {repayments.map((repayment) => (
                      <TableRow key={repayment.id}>
                        <TableCell>${repayment.repaymentAmount}</TableCell>
                        <TableCell>{repayment.repaymentDate}</TableCell>
                        <TableCell>
                          <Button color="primary" onClick={() => handleOpenRepaymentDialog(repayment)}>
                            <Edit />
                          </Button>
                          <Button color="error" onClick={() => handleDeleteRepayment(repayment.id)}>
                            <Delete />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Credit Form Dialog */}
      <Dialog open={openCreditDialog} onClose={handleClose}>
        <DialogTitle>{creditForm.id ? "Edit Credit" : "Add Credit"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={creditForm.description}
            onChange={(e) => handleChange(e, "credit")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Credit Amount"
            name="creditAmount"
            type="number"
            value={creditForm.creditAmount}
            onChange={(e) => handleChange(e, "credit")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={creditForm.dueDate}
            onChange={(e) => handleChange(e, "credit")}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitCredit} color="primary">{creditForm.id ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>

      {/* Repayment Form Dialog */}
      <Dialog open={openRepaymentDialog} onClose={handleClose}>
        <DialogTitle>{repaymentForm.id ? "Edit Repayment" : "Add Repayment"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Repayment Amount"
            name="repaymentAmount"
            type="number"
            value={repaymentForm.repaymentAmount}
            onChange={(e) => handleChange(e, "repayment")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Repayment Date"
            name="repaymentDate"
            type="date"
            value={repaymentForm.repaymentDate}
            onChange={(e) => handleChange(e, "repayment")}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitRepayment} color="primary">{repaymentForm.id ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CreditPage;
