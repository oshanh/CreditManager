
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";


function Navbar(){
    return(
        <>
        {/* Navbar */}
        <AppBar position="static">
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
        </>
    );
}

export default Navbar;