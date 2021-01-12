import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import userReducer from './reducers/userReducer';
import notificationReducer from './reducers/notificationReducer';
import dataReducer from './reducers/dataReducer';
import scheduleReducer from './reducers/scheduleReducer';
import circuitReducer from './reducers/circuitReducer';

const reducer = combineReducers({
  data: dataReducer,
  notification: notificationReducer,
  user: userReducer,
  schedule: scheduleReducer,
  circuits: circuitReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
