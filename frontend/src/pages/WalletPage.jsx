import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

const WalletPage = () => {
  const { user, login } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 0);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/wallet`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setWalletBalance(res.data.walletBalance);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch wallet data.");
      setTransactions([]);
    }
  };

  const handleAddFunds = async () => {
    if (amount <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/wallet/add`,
        { amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const newBalance = res.data.newBalance;
      login(localStorage.getItem("token"), {
        ...user,
        walletBalance: newBalance,
      });

      setWalletBalance(newBalance);
      setMessage("Wallet updated successfully!");
      fetchWalletData();
    } catch (err) {
      console.log(err);
      setMessage("Error updating wallet.");
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: 4 }}>
      <Typography variant="h4" textAlign="center">
        Wallet
      </Typography>
      <Typography variant="h6" color="textSecondary" textAlign="center" mt={2}>
        Balance: {walletBalance} points
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mt: 2, mx: "auto", maxWidth: 600 }}>
          {message}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <TextField
          type="number"
          label="Enter Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={handleAddFunds}
        >
          Add Funds
        </Button>
      </Box>

      {/* Transaction History */}
      <Box mt={4}>
        <Typography variant="h6" textAlign="center" mb={2}>
          Transaction History
        </Typography>

        <Grid container spacing={2} sx={{ px: 4 }}>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    boxShadow: 2,
                    borderLeft: `6px solid ${
                      transaction.type === "debit" ? "#d32f2f" : "#2e7d32"
                    }`,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {transaction.amount} points
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {transaction.type === "debit" ? "Debited" : "Credited"}
                    </Typography>
                    <Typography variant="body1">
                      {transaction.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {transaction.date
                        ? new Date(transaction.date).toLocaleString()
                        : "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              align="center"
              color="textSecondary"
              sx={{ width: "100%", mt: 2 }}
            >
              No transactions yet.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default WalletPage;
