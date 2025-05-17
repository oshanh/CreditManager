import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Avatar, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "../assets/profile.png"; // Placeholder image for the card background
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const mockDebtors = [
    {
        id: 1,
        name: "John Doe",
        image: Image,
        outstanding: 500000,
    },
    {
        id: 2,
        name: "Jane Smith",
        image: Image,
        outstanding: 300000,
    },
    {
        id: 3,
        name: "Alice Johnson",
        image: Image,
        outstanding: 200000,
    },
    {
        id: 4,
        name: "Bob Brown",
        image: Image,
        outstanding: 10000,
    },
    ...Array.from({ length: 26 }, (_, i) => ({
        id: i + 5,
        name: `Debtor ${i + 5}`,
        image: Image,
        outstanding: Math.random() > 0.5 ? Math.floor(Math.random() * 900000) + 100000 : Math.floor(Math.random() * 9000) + 1000,
    })),
];

const Debtors = () => {
  const [debtors, setDebtors] = useState([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  console.log("inside Debtors", user);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
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
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {debtors.map((debtor) => {
        const circleRadius = (debtor.outstanding / totalOutstanding) * 100 * 15;

        return (
          <Grid xs={12} sm={6} md={4} lg={3} key={debtor.id}>
            <Link to={`/debtor/${debtor.id}`} style={{ textDecoration: "none" }}>
              <Card sx={{ textAlign: "center", padding: 2, border: 0, backgroundColor: "transparent" }}>
                <Avatar
                  src={debtor.image}
                  alt={debtor.name}
                  sx={{
                    width: circleRadius,
                    height: circleRadius,
                    minWidth: 75,
                    minHeight: 75,
                    borderRadius: "50%",
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
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Debtors;
