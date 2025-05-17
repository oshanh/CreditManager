import React, { useState, useEffect } from "react";
import customerService from "../services/customerService";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Typography, Box } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid
import Alerts from '../components/Alerts';
import GeneralSnackbarAlerts from "../components/GeneralSnackbarAlerts";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({ customerName: "", contactNumber: "", id: "" });

  // Fetch all customers
  useEffect(() => {
    customerService
      .getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  console.log(customers);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open the dialog to add or edit a customer
  const handleOpen = (customer = null) => {
    if (customer) {
      setCustomerForm({ ...customer });
    } else {
      setCustomerForm({ customerName: "", contactNumber: "", id: "" });
    }
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm({ ...customerForm, [name]: value });
  };

  // Handle customer form submission (Add/Update)
  const handleSubmit = () => {
    if (customerForm.id) {
      // Update existing customer
      customerService
        .updateCustomer(customerForm.id, customerForm)
        .then(() => {
          setCustomers(customers.map((customer) => (customer.id === customerForm.id ? customerForm : customer)));
        });
    } else {
      // Create new customer
      customerService.createCustomer(customerForm).then((newCustomer) => {
        setCustomers([...customers, newCustomer]);
      });
    }
    handleClose();
  };

  const [deleteConfirmation,setDeleteConfirmation]=useState(false);
  const [deleteConfirmationDialog,setDeleteConfirmationDialog]=useState(false);
  const [IdToDelete,setIdToDelete]=useState(null);

  const handleDeleteDialogOpen =(id)=>{
    setIdToDelete(id);
    setDeleteConfirmationDialog(true);
    
  };



  // Handle delete customer
  const handleDelete = () => {

    customerService.deleteCustomer(IdToDelete).then(() => {
      setCustomers(customers.filter((customer) => customer.id !== IdToDelete));
    });
    setDeleteConfirmationDialog(false);
    setAlert("Customer Deleted successfully !");
    setTimeout(()=>setAlert(null),2000);


  };

  // Columns for DataGrid
  const columns = [
    { field: 'customerName', headerName: 'Customer Name', width: 200,
      renderCell: (params) => (
        <Link to={`/credits/${params.row.id}`} style={{ textDecoration: "none", color: "inherit" }} state={{ customerName: params.row.customerName }} >
          {params.row.customerName}
        </Link>
      ),
     },
    { field: 'contactNumber', headerName: 'Contact Number', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleOpen(params.row)}>
            <Edit />
          </Button>
          <Button color="error" onClick={() =>handleDeleteDialogOpen(params.row.id) }>
            <Delete />
          </Button>
        </>
      ),
    },
  ];

  const rows = filteredCustomers.map((customer) => ({
    id: customer.id,
    customerName: customer.customerName,
    contactNumber: customer.contactNumber,
  }));

  const [alert,setAlert]=useState(null);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mt: 4 }}>
      
      {alert &&
        <GeneralSnackbarAlerts
          open={alert}
          setOpen={setOpen}
          msg={alert}
          type='error'
          />


      }
      <Typography variant="h4" sx={{ mb: 2 }}>
        Customers
      </Typography>


      {/* Add New Customer Button */}
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        <Add sx={{ mr: 1 }} /> Add New Customer
      </Button>

      {/* Search Input */}
      <TextField
        fullWidth
        label="Search by name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3, bgcolor: "background.paper", borderRadius: 1 }}
      />

      {/* Customers DataGrid */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      <Dialog open={deleteConfirmationDialog} onClose={()=>{setDeleteConfirmationDialog(false)}}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete?</Typography>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={()=>{setDeleteConfirmationDialog(false);}} color="error">No</Button>
        </DialogContent>
      </Dialog>

      {/* Customer Form Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{customerForm.id ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={customerForm.customerName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={customerForm.contactNumber}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{customerForm.id ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerPage;
