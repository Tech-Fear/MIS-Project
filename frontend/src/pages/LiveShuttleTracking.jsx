import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

const LiveShuttleTracking = () => {
  const [shuttles, setShuttles] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchShuttles();
    getUserLocation();
  }, []);

  const fetchShuttles = async () => {
    try {
      const res = await axios.get(
        "https://mis-backend-phi.vercel.app/api/shuttle/shuttles"
      );
      if (Array.isArray(res.data.shuttles)) {
        setShuttles(res.data.shuttles);
        setRoutes(
          res.data.shuttles.map((shuttle) => ({
            id: shuttle._id,
            name: shuttle.name,
            route: shuttle.route.stops.map((stop) => [stop.lat, stop.lng]),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch shuttles:", err);
      setShuttles([]);
      setRoutes([]);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {}
      );
    }
  };

  const MoveToUserLocation = () => {
    const map = useMap();
    useEffect(() => {
      if (userLocation) {
        map.flyTo(userLocation, 14);
      }
    }, [userLocation, map]);
    return null;
  };

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" mt={4}>
        Live Shuttle Tracking
      </Typography>

      <Box mt={3}>
        <MapContainer
          center={userLocation || [28.6139, 77.209]}
          zoom={14}
          style={{ height: "600px", width: "100%" }}
        >
          <MoveToUserLocation />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {routes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.route}
              color={getRandomColor()}
            />
          ))}

          {shuttles.map((shuttle) => (
            <Marker
              key={shuttle._id}
              position={[
                shuttle.currentLocation.lat,
                shuttle.currentLocation.lng,
              ]}
            >
              <Popup>
                <b>{shuttle.name}</b> <br />
                Available Seats: {shuttle.availableSeats}
              </Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </Box>
    </Container>
  );
};

export default LiveShuttleTracking;
