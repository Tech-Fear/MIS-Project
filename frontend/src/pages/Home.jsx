import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Box, Button, Container, Fab, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 63,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {" "}
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Shuttle Management System
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.85)" paragraph>
            Book, manage, and track your campus shuttle with ease and
            convenience.
          </Typography>

          {user ? (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff9800",
                "&:hover": { backgroundColor: "#e68900" },
                fontSize: "1.2rem",
                px: 4,
                py: 1,
                mt: 2,
              }}
              onClick={() =>
                navigate(user.role === "admin" ? "/admin" : "/booking")
              }
            >
              {user.role === "admin"
                ? "Go to Admin Dashboard"
                : "Book a Shuttle"}
            </Button>
          ) : (
            <Box mt={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#388e3c" },
                  fontSize: "1.1rem",
                  px: 3,
                  py: 1,
                  mr: 2,
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "#fff",
                  },
                  fontSize: "1.1rem",
                  px: 3,
                  py: 1,
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Box>
          )}

          {/* Admin Floating Button */}
          {user?.role === "admin" && (
            <Fab
              color="secondary"
              aria-label="admin"
              onClick={() => navigate("/admin")}
              sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                boxShadow: 4,
              }}
            >
              <AdminPanelSettingsIcon />
            </Fab>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Home;
