/**
 * Handles the dispatched actions to update the notification to the Redux state.
 */
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;
    case 'REMOVE_NOTIFICATION':
      return null;
    default:
      return state;
  }
};

/**
 * Dispatcher for setting the notification message.
 * @param message
 * @param type either 'error' or 'success'
 */
export const setNotification = (message, type) => {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, type }
    });
  }
};

/**
 * Dispatcher for removing the notification message.
 */
export const removeNotification = () => {
  return dispatch => {
    dispatch({
      type: 'REMOVE_NOTIFICATION'
    });
  }
};

export default notificationReducer;
