import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "https://mis-backend-phi.vercel.app";

const ShuttleBooking = () => {
  const { user, login } = useContext(AuthContext);
  const [stops, setStops] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [bestRoutes, setBestRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/shuttle/stops`);
      setStops(res.data.stops || []);
    } catch (err) {
      console.error("Failed to fetch shuttle stops:", err);
      showMessage("Failed to load shuttle stops.", "error");
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      showMessage("Geolocation is not supported by this browser.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        showMessage("Location acquired successfully!", "success");
      },
      () => {
        showMessage("Failed to get current location.", "error");
      }
    );
  };

  const fetchBestRoute = async () => {
    if (!destination) {
      showMessage("Please select a destination.", "error");
      return;
    }

    setLoading(true);
    setBestRoutes([]);

    try {
      let requestData = { destination };

      if (!source) {
        if (!userLocation) {
          showMessage("Please select a source or enable location.", "error");
          setLoading(false);
          return;
        }
        requestData.currentLat = userLocation.lat;
        requestData.currentLng = userLocation.lng;
      } else {
        requestData.source = source;
      }

      const { data } = await axios.post(
        `${API_BASE_URL}/api/shuttle/best-route`,
        requestData
      );

      const formattedRoutes = data.routes.map((route) => ({
        ...route,
        estimatedTravelTime:
          typeof route.estimatedTravelTime === "object"
            ? "N/A"
            : `${route.estimatedTravelTime} min`,
      }));

      setBestRoutes(formattedRoutes);
      showMessage("Best routes found!", "success");
    } catch (err) {
      showMessage(
        err.response?.data?.msg || "Failed to find a route.",
        "error"
      );
    }

    setLoading(false);
  };

  const handleBooking = async () => {
    if (!selectedRoute) {
      showMessage("Please select a route before booking.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showMessage("User not authenticated.", "error");
      return;
    }

    setLoading(true);
    try {
      const cost = selectedRoute.cost;
      const { data } = await axios.post(
        `${API_BASE_URL}/api/shuttle/book`,
        {
          route: selectedRoute.stops,
          cost: selectedRoute.cost,
          estimatedTravelTime: selectedRoute.estimatedTravelTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = localStorage.getItem("user");
      const newBalance = userData.walletBalance - cost;
      login(localStorage.getItem("token"), {
        ...user,
        walletBalance: newBalance,
      });
      showMessage(data.msg, "success");
    } catch (err) {
      showMessage(
        err.response?.data?.msg || "Failed to book shuttle.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4">Shuttle Booking</Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={getUserLocation}
          sx={{ mt: 2 }}
        >
          {userLocation ? "Location Acquired ✅" : "Use Current Location 📍"}
        </Button>

        <Select
          fullWidth
          value={source}
          onChange={(e) => setSource(e.target.value)}
          displayEmpty
          sx={{ mt: 2 }}
        >
          <MenuItem value="" disabled>
            Select Source Stop
          </MenuItem>
          {stops.map(({ stopName }, index) => (
            <MenuItem key={index} value={stopName}>
              {stopName}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          displayEmpty
          sx={{ mt: 2 }}
        >
          <MenuItem value="" disabled>
            Select Destination Stop
          </MenuItem>
          {stops.map(({ stopName }, index) => (
            <MenuItem key={index} value={stopName}>
              {stopName}
            </MenuItem>
          ))}
        </Select>

        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={fetchBestRoute}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Find Best Route"}
        </Button>

        {bestRoutes.length > 0 && (
          <Select
            fullWidth
            value={selectedRoute ? selectedRoute.stops : ""}
            onChange={(e) => {
              const selected = bestRoutes.find(
                (route) => route.stops === e.target.value
              );
              setSelectedRoute(selected);
            }}
            displayEmpty
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>
              Select a Route
            </MenuItem>
            {bestRoutes.map((route, index) => (
              <MenuItem key={index} value={route.stops}>
                {route.stops} - {route.estimatedTravelTime} - ${route.cost}
              </MenuItem>
            ))}
          </Select>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleBooking}
          disabled={loading || !selectedRoute}
        >
          {loading ? <CircularProgress size={24} /> : "Book Shuttle"}
        </Button>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={messageType}
            variant="filled"
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ShuttleBooking;
