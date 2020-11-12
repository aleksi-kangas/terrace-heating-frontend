import loginService from '../services/login.js';
import { setNotification, removeNotification } from './notificationReducer.js';

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

export const login = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials);
      // Set user information to browser's local storage
      window.localStorage.setItem('user', JSON.stringify(user));
      dispatch({
        type: 'LOGIN',
        payload: user
      });
    } catch (e) {
      dispatch(setNotification('Wrong username or password'));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 5000)
    }
  }
};

export const logout = () => {
  return dispatch => {
    window.localStorage.removeItem('user');
    dispatch({
      type: 'LOGOUT'
    })
  }
};

export const fetchUserFromLocalStorage = () => {
  return dispatch => {
    const loggedUser = window.localStorage.getItem('user');
    dispatch({
      type: 'FETCH_USER',
      payload: JSON.parse(loggedUser)
    })
  }
};

export default userReducer;