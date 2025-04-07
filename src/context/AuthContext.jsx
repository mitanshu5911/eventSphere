import React, { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = (userData, tokenData) => {
    if (!userData?.userType) {
      console.error("Invalid login data. Missing role:", userData);
      return;
    }
    console.log(userData._id);
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
