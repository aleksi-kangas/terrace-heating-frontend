import React from 'react';
import ReactDOM from 'react-dom';
import config from './utils/config.js';
import App from './App';
import { SocketIOProvider } from 'use-socketio/lib/io';

ReactDOM.render(
  <React.StrictMode>
    <SocketIOProvider url={config.SOCKET_IO_URL}>
      <App />
    </SocketIOProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
