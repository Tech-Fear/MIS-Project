import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const API_BASE_URL = "http://localhost:5000";
const socket = io(API_BASE_URL);

const UserDashboard = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rideHistory, setRideHistory] = useState([]);
  const [shuttleLoads, setShuttleLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetchWalletData();
    fetchRideHistory();

    socket.on("optimizedRoutes", (data) => {
      setShuttleLoads(data.flowPath);
    });

    return () => {
      socket.off("optimizedRoutes");
    };
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/wallet`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWalletBalance(res.data.walletBalance);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRideHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/ride-history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRideHistory(res.data.rideHistory || []);
    } catch (err) {
      console.error("Failed to fetch ride history:", err);
    }
  };
  return (
    <Container>
      <Typography variant="h4" textAlign="center" mt={3}>
        User Dashboard
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper
            sx={{ p: 3, mt: 3, textAlign: "center", background: "#f5f5f5" }}
          >
            <Typography variant="h6">Wallet Balance</Typography>
            <Typography variant="h4" color="primary">
              {walletBalance} Points
            </Typography>
          </Paper>

          <Paper sx={{ mt: 3, p: 2 }}>
            <Tabs
              value={tabIndex}
              onChange={(e, newIndex) => setTabIndex(newIndex)}
              centered
            >
              <Tab label="Transaction History" />
              <Tab label="Ride History" />
              <Tab label="Live Shuttle Status" />
            </Tabs>

            {tabIndex === 0 && (
              <Box mt={2}>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        mt: 1,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>
                        {transaction.type === "credit"
                          ? "💰 Added"
                          : "🚍 Spent"}{" "}
                        - {transaction.description}
                      </Typography>
                      <Typography
                        color={transaction.type === "credit" ? "green" : "red"}
                      >
                        {transaction.type === "credit" ? "+" : "-"}{" "}
                        {transaction.amount} points
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No transactions yet.
                  </Alert>
                )}
              </Box>
            )}

            {tabIndex === 1 && (
              <Box mt={2}>
                {rideHistory.length > 0 ? (
                  rideHistory.map((ride, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        mt: 1,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>
                        🚍 {ride.shuttleName} - {ride.route}
                      </Typography>
                      <Typography>
                        {new Date(ride.date).toLocaleString()}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No ride history found.
                  </Alert>
                )}
              </Box>
            )}

            {tabIndex === 2 && (
              <Box mt={2}>
                {shuttleLoads.length > 0 ? (
                  shuttleLoads.map((route, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        mt: 1,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>🚍 {route.path.join(" → ")}</Typography>
                      <Typography>Seats Available: {route.flow}</Typography>
                    </Paper>
                  ))
                ) : (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No active shuttles currently.
                  </Alert>
                )}
              </Box>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default UserDashboard;
