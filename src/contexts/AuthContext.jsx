import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { CircularProgress } from '@material-ui/core';
import AuthService from '../services/auth';

// React context for authentication
const AuthContext = createContext({});

/**
 * Authentication context provider.
 * @param children objects to render
 */
const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    /**
    Method for fetching the initial status of user session from the server.
    Updates the state of the context accordingly.
     */
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

  /**
   * Method for logging in a user.
   * Authenticates with the server and updates context accordingly.
   * @param credentials Object { username: String, password: String }
   */
  const login = async (credentials) => {
    try {
      await AuthService.login(credentials);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  /**
   * Method for logging out a user.
   * Destroys the session with the server and updates context accordingly.
   */
  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  // Shown when initial data is still loading
  if (isLoading) {
    return <CircularProgress />;
  }

  // When initial data is loaded, render the application
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
