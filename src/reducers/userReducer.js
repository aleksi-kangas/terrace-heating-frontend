import loginService from '../services/login';
import { setNotification, removeNotification } from './notificationReducer';

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
  dispatch({
    type: 'LOGOUT',
  });
};

export default userReducer;
