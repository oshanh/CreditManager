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
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Credit Manager
                </Typography>
                <Button color="inherit" component={Link} to="/dashboard">
                    Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/debtors">
                    Debtors
                </Button>
                <Button color="inherit" component={Link} to="/login">
                    Login
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;