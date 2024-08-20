import React, { createContext, useState, useEffect } from "react";

import RequestSender from "../common/requestSender";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("email", userData.email);
    sessionStorage.setItem("name", userData.name);
    sessionStorage.setItem("role", userData.role);
    sessionStorage.setItem("uuid", userData.uuid);
    setIsAuthenticated(true);
  };

  const getSessionStatus = async () => {
    const requestSender = new RequestSender();
    const response = await requestSender.sendRequest("session_status", "get");
    const responseStatus = response.status;
    return responseStatus;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    setIsAuthenticated(false);
  };
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const name = sessionStorage.getItem("name");
    const role = sessionStorage.getItem("role");
    const uuid = sessionStorage.getItem("uuid");
    if (email && name && role && uuid) {
      const userData = { email, name, role, uuid };
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, getSessionStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
