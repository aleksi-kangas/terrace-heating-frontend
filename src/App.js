import React, { useEffect, useState } from 'react';
import Switch from 'react-router-dom/Switch.js';
import Route from 'react-router-dom/Route.js';
import moment from 'moment';
import { useSocket } from 'use-socketio/lib/io';
import heatPumpService from './services/heatPump.js';
import { Container } from '@material-ui/core';
import NavBar from './components/NavBar.js';
import Chart from './components/Chart.js';
import Control from './components/Control.js';
import Statistics from './components/Statistics.js';

const App = () => {
  const [data, setData] = useState(null);
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

  const heatDistCircuitVariables = [
    { label: 'Heat Distribution Circuit 1', id: 'heatDistCircuitTemp1' },
    { label: 'Heat Distribution Circuit 2', id: 'heatDistCircuitTemp2' },
    { label: 'Heat Distribution Circuit 3', id: 'heatDistCircuitTemp3' },
  ];

  return (
    <Container>
      <NavBar />
      <Switch>
        <Route path="/charts">
          <Chart
            data={data}
            columns={heatDistCircuitVariables}
            id={'heatDistCircuitTemp'}
            title={'Heat Distribution Circuits'}
          />
        </Route>
        <Route path="/control">
          <Control />
        </Route>
        <Route path="/">
          <Statistics />
        </Route>
      </Switch>
    </Container>
  );
};

export default App;
