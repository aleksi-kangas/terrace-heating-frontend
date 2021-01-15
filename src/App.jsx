import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Route, Redirect, Switch, useHistory,
} from 'react-router-dom';
import moment from 'moment';
import { useSocket } from 'use-socketio';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { blueGrey } from '@material-ui/core/colors';
import Navigation from './components/navigation/Navigation';
import Notification from './components/Notification';
import Graphs from './components/graphs/Graphs';
import Schedules from './components/schedules/Schedules';
import Overview from './components/overview/Overview';
import LoginForm from './components/LoginForm';
import { fetchUserFromLocalStorage } from './reducers/userReducer';
import { initializeData, setData } from './reducers/dataReducer';
import { fetchStatus } from './reducers/statusReducer';
import { initializeSchedules } from './reducers/scheduleReducer';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5390fe',
    },
    secondary: {
      main: blueGrey[900],
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
  data, initializeData, setData, user,
  fetchUserFromLocalStorage, fetchStatus, initializeSchedules,
}) => {
  /*
   Data covers on month period to reduce data transfer and increase performance,
   since older data is not needed for monitoring general trends.
   */
  const dataCoverTimePeriodHours = 24 * 31; // One month
  const history = useHistory();
  const classes = useStyles();

  // Fetch user that's logged in from local storage
  useEffect(() => {
    fetchUserFromLocalStorage();
  }, [fetchUserFromLocalStorage]);

  // Fetch pre-existing data from the API on first mount
  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [initializeData, user]);

  // Fetching status of heating
  useEffect(() => {
    if (user) {
      fetchStatus();
    }
  }, [fetchStatus, user]);

  // Fetch scheduling status and schedules for 'lowerTank' and 'heatDistCircuit3'
  useEffect(() => {
    if (user) {
      initializeSchedules();
    }
  }, [initializeSchedules, user]);

  window.onbeforeunload = () => {
    localStorage.removeItem('user');
  };

  // Subscribe to real-time updates from the server using socket.io
  useSocket('heatPumpData', (heatPumpData) => {
    // Wait until pre-existing data is loaded before adding new data
    if (data) {
      if (data.length === 0) {
        // The database is empty
        const newData = [];
        newData.push(heatPumpData);
        setData(newData);
      } else {
        /*
        Heat-pump data is stored in a 'ring buffer' and therefore,
        some calculations are needed.
        Calculate the time period which is covered by the data.
        If the period exceeds the length of dataCoverTimePeriodHours,
        remove the oldest entry to accommodate the new entry.
         */
        const startTime = moment(data[0].time);
        const endTime = moment(data[data.length - 1].time);
        const duration = moment.duration(endTime.diff(startTime));
        const hours = duration.asHours();
        if (hours < dataCoverTimePeriodHours) {
          const newData = [...data];
          newData.push(heatPumpData);
          setData(newData);
        } else if (hours >= dataCoverTimePeriodHours) {
          const newData = [...data].slice(1);
          newData.push(heatPumpData);
          setData(newData);
        }
      }
    }
  });

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
    fetchUserFromLocalStorage,
    initializeSchedules,
    initializeData,
    setData,
    fetchStatus,
  },
)(App);
