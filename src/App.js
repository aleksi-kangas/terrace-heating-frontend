import React, { useEffect, useState } from 'react';
import Switch from 'react-router-dom/Switch.js';
import Route from 'react-router-dom/Route.js';
import moment from 'moment';
import { useSocket } from 'use-socketio/lib/io';
import heatPumpService from './services/heatPump.js';
import loginService from './services/login.js';
import { Container } from '@material-ui/core';
import Navigation from './components/navigation/Navigation.js';
import Graphs from './components/Graphs.js';
import Control from './components/Control.js';
import Overview from './components/Overview.js';
import LoginForm from './components/LoginForm.js';
import { Redirect } from 'react-router-dom';

const App = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const dataCoverTimePeriodHours = 24 * 7; // One week

  // Fetching pre-existing data
  useEffect(() => {
    heatPumpService
      .getLastWeek()
      .then(data => {
        setData(data);
      });
  }, []);

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
        const endTime = moment(data[data.length - 1]);
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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Validate login on backend
      const user = await loginService.login({
        username: event.target.username.value,
        password: event.target.password.value
      });
      // Set user information to browser's local storage
      window.localStorage.setItem('user', JSON.stringify(user));
      // Update state
      setUser(user);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <Navigation user={user}/>
      <Container>
        <Switch>
          <Route path="/graphs" render={() =>
            user ? <Graphs data={data}/> : <Redirect to="/login" />
          }
          />
          <Route path="/control" render={() =>
            user ? <Control /> : <Redirect to='/login' />
          }
          />
          <Route path="/login">
            <LoginForm handleLogin={handleLogin} user={user} />
          </Route>
          <Route path="/" render={() =>
            user ? <Overview /> : <Redirect to='/login' />
          }
          />
        </Switch>
      </Container>
    </div>
  );
};

export default App;
