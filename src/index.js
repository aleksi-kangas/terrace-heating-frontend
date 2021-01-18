import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import store from './store';
import { WebSocketProvider } from 'use-websockets';

ReactDOM.render(
  <Provider store={store}>
    <WebSocketProvider url="ws://localhost:3003">
      <Router>
        <App />
      </Router>
    </WebSocketProvider>
  </Provider>,
  document.getElementById('root'),
);
