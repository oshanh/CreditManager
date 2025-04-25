import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Welcome = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "rbga(0, 0, 0, 0.8)",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Debtor Tracker
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px", color: "text.secondary" }}>
        Keep track of your debts and manage them efficiently.
      </Typography>
      <Button
        component={Link}
        to="/login"
        variant="contained"
        color="primary"
        size="large"
        sx={{
          textTransform: "none",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default Welcome;