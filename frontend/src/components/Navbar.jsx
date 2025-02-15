import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Shuttle Management
        </Typography>

        <Box>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/booking">
                Book Shuttle
              </Button>
              <Button color="inherit" component={Link} to="/wallet">
                Wallet ({user.walletBalance} points)
              </Button>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/tracking">
                Live Tracking
              </Button>

              {user.role === "admin" && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Dashboard
                </Button>
              )}

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
