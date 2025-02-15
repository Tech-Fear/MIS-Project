import {
  Alert,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  //   const { user } = useContext(AuthContext);
  const [shuttles, setShuttles] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShuttles();
    fetchUsers();
  }, []);

  const fetchShuttles = async () => {
    try {
      const res = await axios.get(
        "https://mis-backend-phi.vercel.app/api/admin/shuttles",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShuttles(res.data.shuttles);
    } catch (err) {
      console.log(err);
      setError("Failed to load shuttles.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://mis-backend-phi.vercel.app/api/admin/users",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
      setError("Failed to load users.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" mt={4}>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box mt={4}>
        <Typography variant="h6">Manage Shuttles</Typography>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shuttle Name</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Capacity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shuttles.map((shuttle) => (
                <TableRow key={shuttle._id}>
                  <TableCell>{shuttle.name}</TableCell>
                  <TableCell>{shuttle.route}</TableCell>
                  <TableCell>{shuttle.capacity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Manage Users</Typography>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Wallet Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.walletBalance} points</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
