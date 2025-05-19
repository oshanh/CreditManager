import React, { createContext, useContext, useState, useMemo } from "react";
import PropTypes from 'prop-types';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try loading from sessionStorage on initial load
    const id = sessionStorage.getItem("userId");
    const nickname = sessionStorage.getItem("nickname");
    return id ? { id, nickname } : null;
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("userId", userData.id);
    sessionStorage.setItem("nickname", userData.nickname);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("nickname");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default UserContext;
