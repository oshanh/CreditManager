import React, { useState } from 'react';
import LoginService from '../services/LoginService';
import { ethers } from 'ethers';
import { toUtf8Bytes, hexlify } from 'ethers';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';


import { Google as GoogleIcon, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { 
Box, 
Button, 
TextField, 
Typography, 
Container, 
Paper, 
Divider, 
IconButton, 
InputAdornment, 
ThemeProvider, 
createTheme 
} from '@mui/material';

const darkTheme = createTheme({
palette: {
    mode: 'dark',
    primary: {
        main: '#90caf9',
    },
    secondary: {
        main: '#f48fb1',
    },
},
});

const Login = () => {

    const navigate = useNavigate();
    //using ethers.js to sign a message with MetaMask
    const handleWeb3LoginE = async () => {
        if (!window.ethereum) {
            alert('MetaMask not detected. Please install MetaMask.');
            return;
        }
    
        try {
            // Step 1: Initialize provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(); // access MetaMask account
            const address = await signer.getAddress(); // get user's Ethereum address
    
            // Step 2: Define the message to sign
            const message = "o"; // ideally a random nonce for security
    
            // Step 3: Sign the message (includes Ethereum prefix internally)
            const signature = await signer.signMessage(message); // MetaMask popup
    
            // Step 4: Log everything for backend debugging
            console.log("🔹 Address:", address);
            console.log("🔹 Message:", message);
            console.log("🔹 Message (Hex):", hexlify(toUtf8Bytes(message)));
            console.log("Message (hex):", hexlify(toUtf8Bytes("\x19Ethereum Signed Message:\n1o")));
            console.log("🔹 Signature:", signature);
    
            // Step 5: Send to backend for verification
            const result = await LoginService.loginWithWeb3(address, message, signature);
    
            // Step 6: Display result
            if (result.success) {
                alert(`Welcome, ${result.nickname}!`);
            } else {
                alert("Web3 login failed");
            }
        } catch (error) {
            console.error("❌ Error during Web3 login:", error);
        }
    };
    

// Uncomment the following code if you want to use Web3.js instead of ethers.js
const handleWeb3LoginW = async () => {
    if (!window.ethereum) {
        alert('MetaMask not detected. Please install MetaMask.');
        return;
    }


    try {
        const web3 = new Web3(window.ethereum);

        // Request user accounts
        const accounts = await web3.eth.requestAccounts();
        const address = accounts[0]; // Get the connected address
        console.log("Connected address:", address);

        // Message to sign
        const message = "Login";

        // Sign the message using MetaMask
        const signature = await web3.eth.personal.sign(message, address, '');

        // Send the message, signature, and address to the backend for verification
        const result = await LoginService.loginWithWeb3(address, message, signature);
        console.log("Web3 login result:", result);
        if (result.success) {
            alert(`Welcome, ${result.nickname}!`);
            // TODO: Navigate or store user context
        } else {
            alert("Web3 login failed");
        }
    } catch (error) {
        console.error("Error during Web3 login:", error);
        alert("Web3 login error. Check console for details.");
    }
};
    
    

const [formData, setFormData] = useState({
    username: '',
    password: '',
});

const [showPassword, setShowPassword] = useState(false);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    // For now, just navigate to the dashboard or show a success message
    
    navigate('/dashboard');
    console.log('Login attempted with:', formData);
};

const handleGoogleLogin = () => {
    // TODO: Implement Google login integration
    navigate('/dashboard');
    console.log('Google login clicked');
};

return (
    <ThemeProvider theme={darkTheme}>
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper 
                elevation={10} 
                sx={{ 
                    padding: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#90caf9' }}>
                    Credit Manager
                </Typography>
                
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                    Sign In
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.2 }}
                        endIcon={<LoginIcon />}
                    >
                        Sign In
                    </Button>
                    
                    <Divider sx={{ my: 2 }}>OR</Divider>
                    
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoogleLogin}
                        startIcon={<GoogleIcon />}
                        sx={{ 
                            mt: 1, 
                            mb: 2, 
                            py: 1.2,
                            color: '#fff',
                            borderColor: '#df4a32',
                            '&:hover': {
                                borderColor: '#c62828',
                                backgroundColor: 'rgba(223, 74, 50, 0.1)',
                            }
                        }}
                    >
                        Continue with Google
                    </Button>
                    <Button
                        fullWidth
                        disabled
                        variant="outlined"
                        onClick={handleWeb3LoginE}
                        sx={{
                            py: 1.2,
                            color: '#fff',
                            borderColor: '#f3ba2f',
                            '&:hover': {
                                borderColor: '#c8a600',
                                backgroundColor: 'rgba(243, 186, 47, 0.1)',
                            },
                        }}
                    >
                        Connect with MetaMask
                    </Button>

                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button color="secondary" variant="text" size="small">
                            Forgot Password?
                        </Button>
                        <Button color="secondary" variant="text" size="small">
                            Create Account
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    </ThemeProvider>
);
};

export default Login;