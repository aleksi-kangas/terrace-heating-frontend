import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Route, Redirect, Switch, useHistory,
} from 'react-router-dom';
import moment from 'moment';
import { useSocket } from 'use-socketio';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { blueGrey } from '@material-ui/core/colors';
import Navigation from './components/navigation/Navigation';
import Notification from './components/Notification';
import Graphs from './components/graphs/Graphs';
import Control from './components/control/Control';
import Overview from './components/overview/Overview';
import LoginForm from './components/LoginForm';
import { fetchUserFromLocalStorage } from './reducers/userReducer';
import { initializeData, setData } from './reducers/dataReducer';
import { fetchActiveCircuits } from './reducers/circuitReducer';
import { fetchSchedule } from './reducers/scheduleReducer';

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

const App = (
  {
    data, initializeData, setData, user, fetchUserFromLocalStorage, fetchActiveCircuits, fetchSchedule,
  },
) => {
  /*
   Data covers on month period to reduce data transfer and increase performance,
   since older data is not needed for monitoring general trends.
   */
  const dataCoverTimePeriodHours = 24 * 31; // One month
  const history = useHistory();

  // Fetch user that's logged in from local storage
  useEffect(() => {
    fetchUserFromLocalStorage();
  }, [fetchUserFromLocalStorage]);

  // Fetch pre-existing data from the API on first mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Fetching active circuits
  useEffect(() => {
    fetchActiveCircuits();
  }, [fetchActiveCircuits]);

  // Fetching active circuits
  useEffect(() => {
    fetchSchedule('lowerTank');
    fetchSchedule('heatDistCircuit3');
  }, [fetchActiveCircuits]);

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
      <div>
        <Navigation />
        <Notification />
        <Switch>
          <Route
            path="/graphs/"
            render={() => (user ? <Graphs /> : <Redirect to="/login" />)}
          />
          <Route
            path="/control"
            render={() => (user ? <Control /> : <Redirect to="/login" />)}
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
      </div>
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
    fetchUserFromLocalStorage, initializeData, setData, fetchActiveCircuits, fetchSchedule,
  },
)(App);
