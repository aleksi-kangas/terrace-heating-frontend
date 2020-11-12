import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import config from './utils/config.js';
import App from './App.js';
import store from './store.js'
import { SocketIOProvider } from 'use-socketio';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <SocketIOProvider url={config.SOCKET_IO_URL}>
        <App />
      </SocketIOProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);
