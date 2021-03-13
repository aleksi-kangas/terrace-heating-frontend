import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

type PrivateRouteProps = {
  component: React.ElementType,
  dataTimePeriod?: number,
  setDataTimePeriod?: (days: number) => void,
  path: string,
}

/**
 * Represents a private route, which requires a logged-in status.
 * @param Component
 * @param dataTimePeriod data coverage period
 * @param setDataTimePeriod method for changing data coverage period
 * @param path
 * @param rest
 */
const PrivateRoute = ({
  component: Component, dataTimePeriod, setDataTimePeriod, path,
}: PrivateRouteProps): JSX.Element => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route path={path}>
      {
        isAuthenticated
          ? (
            <Component
              component={Component}
              dataTimePeriod={dataTimePeriod}
              setDataTimePeriod={setDataTimePeriod}
            />
          )
          : <Redirect to={{ pathname: '/login', state: { from: location } }} />
      }
    </Route>
  );
};

export default PrivateRoute;
