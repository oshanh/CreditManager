import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Avatar, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "../assets/profile.png"; // Placeholder image for the card background
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import customerService from "../services/customerService";
import { useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mockDebtors = [
    {
        id: 1,
        name: "John Doe",
        image: Image,
        totalCredit: 500000,
    },
    {
        id: 2,
        name: "Jane Smith",
        image: Image,
        totalCredit: 300000,
    },
    {
        id: 3,
        name: "Alice Johnson",
        image: Image,
        totalCredit: 200000,
    },
    {
        id: 4,
        name: "Bob Brown",
        image: Image,
        totalCredit: 10000,
    },
    ...Array.from({ length: 26 }, (_, i) => ({
        id: i + 5,
        name: `Debtor ${i + 5}`,
        image: Image,
        totalCredit: Math.random() > 0.5 ? Math.floor(Math.random() * 900000) + 100000 : Math.floor(Math.random() * 9000) + 1000,
    })),
];

const Debtors = () => {
  const getDebtors=customerService.getAllCustomers;


  const [debtors, setDebtors] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  console.log("inside Debtors", user);

  const passedState = useLocation().state;
  console.log("Passed state:", passedState);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const data = await getDebtors();
        console.log("Fetched debtors:", data);
        setDebtors(data);
        const total = data.reduce((acc, debtor) => acc + debtor.totalCredit, 0);
        setTotalCredit(total);
      } catch (error) {
        console.error("Error fetching debtors:", error);
      } finally {
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
        const circleRadius = (debtor.totalCredit / totalCredit) * 100 * 15;

        return (
          <Grid xs={12} sm={6} md={4} lg={3} key={debtor.id}>
            <Link to={`/debtor/${debtor.id}`} 
                  state={{ debtorId: debtor.id }}
                  style={{ textDecoration: "none" }}>
              <Card sx={{ textAlign: "center", padding: 2, border: 0, backgroundColor: "transparent" }}>
                <Avatar
                  src={debtor.profilePhotoPath? `${API_BASE_URL}${debtor.profilePhotoPath}`: Image}
                  alt={debtor.customerName}
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
                  <Typography variant="h6">{debtor.customerName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {debtor.contactNumber}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Total : Rs.{debtor.totalCredit.toFixed(2)}
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
