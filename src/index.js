import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import config from './utils/config.js';
import App from './App';
import { SocketIOProvider } from 'use-socketio';

ReactDOM.render(
  <Router>
    <SocketIOProvider url={config.SOCKET_IO_URL}>
      <App />
    </SocketIOProvider>
  </Router>,
  document.getElementById('root')
);
