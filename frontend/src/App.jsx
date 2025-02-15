import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import LiveShuttleTracking from "./pages/LiveShuttleTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShuttleBooking from "./pages/ShuttleBooking";
import UserDashboard from "./pages/UserDashboard";
import WalletPage from "./pages/WalletPage";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <ShuttleBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <WalletPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tracking"
                element={
                  <ProtectedRoute>
                    <LiveShuttleTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
