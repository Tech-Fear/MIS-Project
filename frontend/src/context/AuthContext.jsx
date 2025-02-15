// import axios from "axios";
// import PropTypes from "prop-types";
// import { createContext, useEffect, useState } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios
//         .get("http://localhost:5000/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => setUser(res.data))
//         .catch(() => setUser(null))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = (token, userData) => {
//     localStorage.setItem("token", token);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default AuthProvider;
import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try to load the user from localStorage (saved as JSON string)
  const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(false);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
