import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketIOProvider } from 'use-socketio';
import App from './App';
import store from './store';

const options = { transports: ['websocket'] };

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <SocketIOProvider url="ws://localhost:3003" opts={options}>
        <App />
      </SocketIOProvider>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
