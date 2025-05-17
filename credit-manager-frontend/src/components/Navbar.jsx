import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar(){
    return(
        <AppBar 
            position="sticky" 
            sx={{ 
                top: 0,
                zIndex: 1100,
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(18, 18, 18, 0.8)'
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ 
                        flexGrow: 1, 
                        textDecoration: 'none', 
                        color: 'inherit',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}
                    component={Link}
                    to="/"
                >
                    Credit Manager
                </Typography>
                <Button 
                    color="inherit" 
                    component={Link} 
                    to="/dashboard"
                    sx={{ fontSize: '1.1rem' }}
                >
                    Dashboard
                </Button>
                <Button 
                    color="inherit" 
                    component={Link} 
                    to="/"
                    sx={{ fontSize: '1.1rem' }}
                >
                    Home
                </Button>
                <Button 
                    color="inherit" 
                    component={Link} 
                    to="/debtors"
                    sx={{ fontSize: '1.1rem'}}
                >
                    Debtors
                </Button>
                <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    sx={{ fontSize: '1.1rem' }}
                >
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;