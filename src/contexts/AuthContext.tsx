import React, { createContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from '../services/auth';
import { Credentials, User } from '../types';
import { initializeAction } from '../reducers/heatPumpReducer';

const useStyles = makeStyles(() => ({
  loading: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

type AuthContext = {
  isAuthenticated: boolean,
  login: (credentials: Credentials) => Promise<User | null>,
  logout: () => void,
}

// React context for authentication
export const AuthContext = createContext<AuthContext>({} as AuthContext);

type AuthProviderProps = {
  children: JSX.Element,
  initialize: () => Promise<void>,
}

/**
 * Authentication context provider.
 * @param children objects to render
 * @param initialize Redux-action for initializing heat-pump data
 */
const AuthProvider = ({ children, initialize }: AuthProviderProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const classes = useStyles();

  useEffect(() => {
    /**
    Method for fetching the initial status of user session from the server.
    Updates the state of the context accordingly.
     */
    const fetchAuthStatus = async () => {
      const result = await AuthService.fetchAuth();
      if (result) {
        await initialize();
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
  const login = async (credentials: Credentials): Promise<User | null> => {
    try {
      const user = await AuthService.login(credentials);
      await initialize();
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      setIsAuthenticated(false);
      return null;
    }
  };

  /**
   * Method for logging out a user.
   * Destroys the session with the server and updates context accordingly.
   */
  const logout = async (): Promise<void> => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  // Shown when initial data is still loading
  if (isLoading) {
    return <CircularProgress className={classes.loading} />;
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

export default connect(null, { initialize: initializeAction })(AuthProvider);
