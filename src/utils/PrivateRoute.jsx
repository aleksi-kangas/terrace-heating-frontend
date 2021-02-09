import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Represents a private route, which requires a logged-in status.
 * @param Component
 * @param dataTimePeriod data coverage period
 * @param setDataTimePeriod method for changing data coverage period
 * @param rest
 */
const PrivateRoute = ({
  component: Component, dataTimePeriod, setDataTimePeriod, ...rest
}) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Route {...rest}>
      {
        isAuthenticated
          ? <Component dataTimePeriod={dataTimePeriod} setDataTimePeriod={setDataTimePeriod} />
          : <Redirect to={{ pathname: '/login', state: { from: location } }} />
      }
    </Route>
  );
};

export default PrivateRoute;
