import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Avatar, CircularProgress } from "@mui/material";
import Image from "../assets/PP1.jpg"; // Placeholder image for the card background
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const mockDebtors = [
  {
    id: 1,
    name: "John Doe",
    image: Image,
    outstanding: 50000,
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://via.placeholder.com/150",
    outstanding: 30000,
  },
  {
    id: 3,
    name: "Alice Johnson",
    image: "https://via.placeholder.com/150",
    outstanding: 20000,
  },
  {
    id: 4,
    name: "Bob Brown",
    image: "https://via.placeholder.com/150",
    outstanding: 10000,
  },
];

const Debtors = () => {
  const [debtors, setDebtors] = useState([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchDebtors = async () => {
      try {
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = mockDebtors;

        setDebtors(data);
        const total = data.reduce((sum, debtor) => sum + debtor.outstanding, 0);
        setTotalOutstanding(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching debtors:", error);
        setLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
        <Navbar />
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {debtors.map((debtor) => {
        const circleRadius = (debtor.outstanding / totalOutstanding) * 100;

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={debtor.id}>
            <Card sx={{ textAlign: "center", padding: 2, border: 0, backgroundColor: "transparent" }}>
              <Avatar
            src={debtor.image}
            alt={debtor.name}
            sx={{
              width: circleRadius,
              height: circleRadius,
              margin: "0 auto",
              border: "2px solid #1976d2",
              backgroundColor: "transparent",
            }}
              />
              <CardContent>
            <Typography variant="h6">{debtor.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Outstanding: ${debtor.outstanding.toFixed(2)}
            </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
    </>
  );
};

export default Debtors;