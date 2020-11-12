import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import moment from 'moment';
import { useSocket } from 'use-socketio/lib/io';
import Navigation from './components/navigation/Navigation.js';
import Graphs from './components/graphs/Graphs.js';
import Control from './components/Control.js';
import Overview from './components/overview/Overview.js';
import LoginForm from './components/LoginForm.js';
import { Redirect, useHistory } from 'react-router-dom';
import { fetchUserFromLocalStorage } from './reducers/userReducer.js';
import { initializeData, setData } from './reducers/dataReducer.js';

const App = ({ data, latest, initializeData, setData, user, fetchUserFromLocalStorage }) => {
  const dataCoverTimePeriodHours = 24 * 7; // One week
  const history = useHistory();

  useEffect(() => {
    // Get logged in user from local storage
    fetchUserFromLocalStorage()
  }, [fetchUserFromLocalStorage]);

  // Fetching pre-existing data
  useEffect(() => {
    initializeData()
  }, [initializeData]);

  // Subscribe to real-time data using socket.io
  useSocket('heatPumpData', heatPumpData => {
    // Wait until pre-existing data is loaded before adding new data
    if (data) {
      if (data.length === 0) {
        // The database is empty
        const newData = [];
        newData.push(heatPumpData);
        setData(newData);
      } else {
        // Calculate the time period that data covers
        // If the data covers more than a fixed time (48 hours) period,
        // remove the oldest entry to accommodate a new entry as in a ring buffer.
        const startTime = moment(data[0].time);
        const endTime = moment(latest.time);
        const duration = moment.duration(endTime.diff(startTime));
        const hours = duration.asHours();
        if (hours < dataCoverTimePeriodHours) {
          const newData = [...data];
          newData.push(heatPumpData);
          setData(newData)
        } else if (hours >= dataCoverTimePeriodHours) {
          const newData = [...data].slice(1);
          newData.push(heatPumpData);
          setData(newData);
        }
      }
    }
  });

  return (
    <div>
      <Navigation/>
      <Switch>
        <Route path="/graphs" render={() =>
          user ? <Graphs/> : <Redirect to="/login" />
        }
        />
        <Route path="/control" render={() =>
          user ? <Control/> : <Redirect to='/login' />
        }
        />
        <Route path="/login" render={() =>
          user ? <Redirect to='/' /> : <LoginForm history={history}/>
        }
        />
        <Route path="/" render={() =>
          user ? <Overview/> : <Redirect to='/login' />
        }
        />
      </Switch>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data,
    latest: state.data.latest,
    user: state.user,
  }
};

export default connect(mapStateToProps, { fetchUserFromLocalStorage, initializeData, setData })(App);
