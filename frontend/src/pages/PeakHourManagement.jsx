import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const PeakHourManagement = () => {
  const [isPeakHour, setIsPeakHour] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchPeakHourStatus();
  }, []);

  const fetchPeakHourStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/peak-hour", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsPeakHour(res.data.isPeakHour);
      setManualOverride(res.data.manualOverride);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch peak hour status.");
      setLoading(false);
    }
  };

  const updatePeakHourStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/admin/set-peak-hour",
        { isPeakHour, manualOverride },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage(res.data.msg);
      setSnackbarOpen(true);
      fetchPeakHourStatus(); // Refresh status
    } catch (err) {
      console.log(err);
      setMessage("Failed to update peak hour status.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4">Peak Hour Management</Typography>
        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <>
            <Typography variant="h6" color="textSecondary" mt={2}>
              Current Peak Hour Status:{" "}
              <strong>{isPeakHour ? "Active" : "Inactive"}</strong>
            </Typography>

            <Box mt={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPeakHour}
                    onChange={() => setIsPeakHour(!isPeakHour)}
                    color="primary"
                  />
                }
                label="Enable Peak Hour"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={manualOverride}
                    onChange={() => setManualOverride(!manualOverride)}
                    color="secondary"
                  />
                }
                label="Manual Override"
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={updatePeakHourStatus}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
};

export default PeakHourManagement;
