import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import heatPumpReducer, { HeatPumpReducerState } from './reducers/heatPumpReducer';
import notificationReducer, { NotificationReducerState } from './reducers/notificationReducer';
// import scheduleReducer from './reducers/scheduleReducer';
// import statusReducer from './reducers/statusReducer';

export type State = {
  heatPump: HeatPumpReducerState;
  notification: NotificationReducerState;
}

// Combine Redux reducers
const reducer = combineReducers({
  heatPump: heatPumpReducer,
  notification: notificationReducer,
  // schedule: scheduleReducer,
  // status: statusReducer,
});

// Redux store
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
