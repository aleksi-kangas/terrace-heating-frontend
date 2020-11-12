import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import userReducer from './reducers/userReducer.js';
import notificationReducer from './reducers/notificationReducer.js';
import dataReducer from './reducers/dataReducer.js';


const reducer = combineReducers({
  data: dataReducer,
  notification: notificationReducer,
  user: userReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;