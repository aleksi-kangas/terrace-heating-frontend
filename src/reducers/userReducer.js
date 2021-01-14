import loginService from '../services/login';
import { setNotification, removeNotification } from './notificationReducer';
import heatPumpService from '../services/heatPump';

/**
 * Handles the dispatched actions to update the user status to the Redux state.
 */
const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return null;
    case 'FETCH_USER':
      return action.payload;
    default:
      return state;
  }
};

/**
 * Action creator for logging in a user.
 * @param credentials Object { username: String, password: String }
 */
export const login = (credentials) => async (dispatch) => {
  try {
    const user = await loginService.login(credentials);
    // Set user information to browser's local storage
    window.localStorage.setItem('user', JSON.stringify(user));
    heatPumpService.setToken(user.token);
    dispatch({
      type: 'LOGIN',
      payload: user,
    });
  } catch (e) {
    dispatch(setNotification('Wrong username or password', 'error'));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 5000);
  }
};

/**
 * Action creator for logging out a user.
 */
export const logout = () => (dispatch) => {
  window.localStorage.removeItem('user');
  heatPumpService.setToken(null);
  dispatch({
    type: 'LOGOUT',
  });
};

/**
 * Action creator for fetching user information from browser's local storage,
 * and updating state accordingly.
 */
export const fetchUserFromLocalStorage = () => (dispatch) => {
  const loggedUser = window.localStorage.getItem('user');
  if (loggedUser) {
    const parsedUser = JSON.parse(loggedUser);
    heatPumpService.setToken(parsedUser.token);
  }
  dispatch({
    type: 'FETCH_USER',
    payload: JSON.parse(loggedUser),
  });
};

export default userReducer;
