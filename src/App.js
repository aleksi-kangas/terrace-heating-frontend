import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSocket } from 'use-socketio/lib/io';
import heatPumpService from './services/heatPump.js'

const App = () => {
  const [data, setData] = useState(null);

  // Fetching pre-existing data
  useEffect(() => {
    heatPumpService
      .getLastWeek()
      .then(data => {
        setData(data);
      });
  }, []);

  // Subscribing to real time data using socket.io client
  useSocket('DataFromAPI', dataFromAPI => {
    // Wait until pre-existing data is loaded before adding new data
    if (data) {
      if (data.length === 0) {
        const newData = [];
        newData.push(dataFromAPI);
        setData(newData);
      } else {
        // Calculate data time period
        const startTime = moment(data[0].time);
        const endTime = moment(data[data.length - 1]);
        const duration = moment.duration(endTime.diff(startTime));
        const hours = duration.asHours();
        if (hours < 48) {
          const newData = [...data];
          newData.push(dataFromAPI);
          setData(newData)
        } else if (hours >= 48) {
          const newData = [...data].slice(1);
          newData.push(dataFromAPI);
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
