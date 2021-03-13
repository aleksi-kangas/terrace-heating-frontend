import React, { useContext, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router-dom';
import moment from 'moment';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { io } from 'socket.io-client';
import Navigation from './components/navigation/Navigation';
import Graphs from './components/graphs/Graphs';
import Schedules from './components/schedules/Schedules';
import Overview from './components/overview/Overview';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import { initializeAction, setDataAction } from './reducers/heatPumpReducer';
import { AuthContext } from './contexts/AuthContext';
import { HeatPumpEntry } from './types';
import { State } from './store';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2F4050',
    },
    secondary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#F6F7FF',
    },
  },
});

const useStyles = makeStyles(() => ({
  toolBar: theme.mixins.toolbar,
  container: {
    padding: 30,
  },
}));

type AppProps = {
  data: HeatPumpEntry[],
  initialize: () => void,
  setData: (data: HeatPumpEntry[]) => void,
}

// eslint-disable-next-line @typescript-eslint/no-shadow
const App = ({ data, initialize, setData }: AppProps) => {
  /*
   Data covers two week period to reduce data transfer and increase performance,
   since older data is not needed for monitoring general trends.
   */
  const maximumDataTimePeriod = 7; // One week
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const classes = useStyles();
  // Create a reference to data, since WebSocket event handler needs one
  const dataRef = useRef(data);

  // Fetch pre-existing data, status of heating, and schedules from the API
  useEffect(() => {
    if (isAuthenticated) {
      initialize();

      /*
    Open WebSocket connection if user has been authorized via HTTP connection.
    Subscribe to real-time heat-pump updates.
     */
      const socket = io(':3003', { transports: ['websocket'] });
      socket.emit('login');

      socket.on('heatPumpData', (heatPumpData) => {
        // Wait until pre-existing data is loaded before adding new data
        if (dataRef.current) {
          const startTimeThreshold = moment(heatPumpData.time).subtract(maximumDataTimePeriod, 'days');
          let newData = [...dataRef.current];
          if (dataRef.current.length !== 0 && startTimeThreshold.isAfter(dataRef.current[0].time)) {
            /*
            Need to drop the oldest entry to accommodate the new entry.
            Frontend holds dataCoverTimePeriodHours amount of data as in a ring buffer.
             */
            newData = newData.slice(1);
          }
          newData.push(heatPumpData);
          setData(newData);
        }
      });
      return () => {
        socket.off('heatPumpData');
      };
    }
    // eslint-disable-next-line no-useless-return, consistent-return
    return;
  }, [isAuthenticated]);

  // Update dataRef which is used in WebSocket connection
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <div className={classes.toolBar} />
      <Grid container className={classes.container}>
        <Switch location={location}>
          <PrivateRoute
            path="/graphs"
            component={Graphs}
          />
          <PrivateRoute path="/schedules" component={Schedules} />
          <Route path="/login">
            <LoginForm />
          </Route>
          <PrivateRoute path="/" component={Overview} />
        </Switch>
      </Grid>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state: State) => ({
  heatPumpData: state.heatPump.data,
});

export default connect(
  mapStateToProps,
  { initialize: initializeAction, setData: setDataAction },
)(App);
