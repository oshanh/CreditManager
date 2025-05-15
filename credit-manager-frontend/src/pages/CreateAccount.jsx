import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

const CreateAccount = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Username/Password, Step 3: Profile Photo
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
  });
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [existingUser, setExistingUser] = useState(null); // Stores existing user data if email exists

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailCheck = async () => {
    setCheckingEmail(true);
    try {
      const response = await axios.get(`/api/users/check-email?email=${formData.email}`);
      if (response.data.exists) {
        setEmailExists(true);
        setExistingUser(response.data.user); // Assuming backend returns user data if email exists
      } else {
        setEmailExists(false);
        setStep(2); // Proceed to the next step
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setErrorMessage("An error occurred while checking the email.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setStep(3); // Proceed to the next step
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAccount = () => {
    // TODO: Implement account creation logic
    console.log("Account created with:", formData);
    navigate("/login"); // Redirect to login after account creation
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            background: "linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#90caf9" }}>
            Create Account
          </Typography>

          {step === 1 && (
            <Box sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleEmailCheck}
                disabled={checkingEmail || !formData.email}
                sx={{ mt: 3, mb: 2, py: 1.2 }}
              >
                {checkingEmail ? <CircularProgress size={24} /> : "Next"}
              </Button>
            </Box>
          )}

          {step === 2 && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ mb: 2 }}
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ""}
                helperText={
                  formData.password !== formData.confirmPassword && formData.confirmPassword !== ""
                    ? "Passwords do not match"
                    : ""
                }
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
                Next
              </Button>
            </Box>
          )}

          {step === 3 && (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Button variant="contained" component="label" fullWidth sx={{ mt: 3, mb: 2, py: 1.2 }}>
                Upload Profile Photo
                <input type="file" hidden accept="image/*" onChange={handleProfilePhotoUpload} />
              </Button>
              {formData.profilePhoto && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Preview:
                  </Typography>
                  <Avatar
                    src={formData.profilePhoto}
                    alt="Profile Preview"
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                  />
                </Box>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleCreateAccount}
                sx={{ mt: 3, mb: 2, py: 1.2 }}
              >
                Create Account
              </Button>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Dialog for Existing User */}
      {emailExists && existingUser && (
        <Dialog open={emailExists} onClose={() => setEmailExists(false)}>
          <DialogTitle>User Already Exists</DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            <Avatar
              src={existingUser.profilePhoto || "https://via.placeholder.com/150"}
              alt={existingUser.username}
              sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}
            />
            <Typography variant="body1">
              The email is already associated with an account. Continue with login.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate("/login")} variant="contained" color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ThemeProvider>
  );
};

export default CreateAccount;