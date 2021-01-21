import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Route {...rest}>
      {
        isAuthenticated
          ? <Component />
          : <Redirect to={{ pathname: '/login', state: { from: location } }} />
      }
    </Route>
  );
};

export default PrivateRoute;
