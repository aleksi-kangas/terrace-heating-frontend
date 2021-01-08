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

export const setNotification = (message) => {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: message
    });
  }
};

export const removeNotification = () => {
  return dispatch => {
    dispatch({
      type: 'REMOVE_NOTIFICATION'
    });
  }
};

export default notificationReducer;