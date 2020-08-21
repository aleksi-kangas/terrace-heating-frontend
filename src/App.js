import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSocket } from 'use-socketio/lib/io';
import heatPumpService from './services/heatPump.js'

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

  // Subscribe to real-time data using a hook socket.io and
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

  return (
    <div className="App">
      <header className="App-header">
        Application
      </header>
    </div>
  );
};

export default App;
