import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Route, Redirect, Switch, useHistory,
} from 'react-router-dom';
import moment from 'moment';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import io from 'socket.io-client';
import Navigation from './components/navigation/Navigation';
import Notification from './components/Notification';
import Graphs from './components/graphs/Graphs';
import Schedules from './components/schedules/Schedules';
import Overview from './components/overview/Overview';
import LoginForm from './components/LoginForm';
import { initializeData, setData } from './reducers/dataReducer';
import { fetchStatus } from './reducers/statusReducer';
import { initializeSchedules } from './reducers/scheduleReducer';
import { setUser } from './reducers/userReducer';
import LoginService from './services/login';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#2F4050',
    },
    background: {
      default: '#F6F7FF',
    },
  },
});

const useStyles = makeStyles(() => ({
  toolBar: theme.mixins.toolbar,
  container: {
    padding: 50,
  },
}));

const App = ({
  data, initializeData, setData, user, setUser, fetchStatus, initializeSchedules,
}) => {
  /*
   Data covers two week period to reduce data transfer and increase performance,
   since older data is not needed for monitoring general trends.
   */
  const dataCoverTimePeriodHours = 24 * 14; // Two weeks
  const history = useHistory();
  const classes = useStyles();
  // Create a reference to data, since WebSocket event handler needs one
  const dataRef = useRef(data);

  // Fetch user session from the API.
  useEffect(() => {
    LoginService
      .fetchSession()
      .then((user) => setUser(user));
  }, []);

  // Fetch pre-existing data, status of heating, and schedules from the API
  useEffect(() => {
    if (user) {
      initializeData();
      fetchStatus();
      initializeSchedules();
    }
  }, [user]);

  // Update dataRef which is used in WebSocket connection
  useEffect(() => {
    dataRef.current = data;
  });

  useEffect(() => {
    /*
    Open WebSocket connection if user has been authorized via HTTP connection.
    Subscribe to real-time heat-pump updates.
     */
    const socket = io('ws://localhost:3003', { transports: ['websocket'] });
    socket.emit('login');

    socket.on('heatPumpData', (heatPumpData) => {
      // Wait until pre-existing data is loaded before adding new data
      if (dataRef.current) {
        const startTimeThreshold = moment(heatPumpData.time).subtract(dataCoverTimePeriodHours, 'hours');
        let newData;
        if (dataRef.current.length !== 0 && startTimeThreshold.isAfter(dataRef.current[0].time)) {
          /*
          Need to drop the oldest entry to accommodate the new entry.
          Frontend holds dataCoverTimePeriodHours amount of data as in a ring buffer.
           */
          newData = [...dataRef.current].slice(1);
          newData.push(heatPumpData);
          setData(newData);
        } else {
          newData = [...dataRef.current];
          newData.push(heatPumpData);
          setData(newData);
        }
      }
    });
    return () => {
      socket.off('heatPumpData');
    };
  }, [user]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <div className={classes.toolBar} />
      <Grid container className={classes.container}>
        <Notification />
        <Switch>
          <Route
            path="/graphs/"
            render={() => (user ? <Graphs /> : <Redirect to="/login" />)}
          />
          <Route
            path="/schedules"
            render={() => (user ? <Schedules /> : <Redirect to="/login" />)}
          />
          <Route
            path="/login"
            render={() => (user ? <Redirect to="/" /> : <LoginForm history={history} />)}
          />
          <Route
            path="/"
            render={() => (user ? <Overview /> : <Redirect to="/login" />)}
          />
        </Switch>
      </Grid>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
});

export default connect(
  mapStateToProps,
  {
    initializeSchedules,
    initializeData,
    setData,
    setUser,
    fetchStatus,
  },
)(App);
