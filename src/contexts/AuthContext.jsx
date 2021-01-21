import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { CircularProgress } from '@material-ui/core';
import AuthService from '../services/auth';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const result = await AuthService.fetchAuth();
      if (result) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    fetchAuthStatus().then();
  }, []);

  const login = async (credentials) => {
    try {
      await AuthService.login(credentials);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated, login, logout,
    }}
    >
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
