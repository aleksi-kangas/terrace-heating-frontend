import { Dispatch } from 'redux';
import { NotificationType } from '../types';

export type NotificationReducerState = {
  message: string,
  type: NotificationType
}

const initialState: NotificationReducerState = {
  message: '',
  type: NotificationType.Error,
};

type SetNotificationAction = { type: 'SET_NOTIFICATION', payload: { message: string, type: NotificationType } }
type RemoveNotificationAction = { type: 'REMOVE_NOTIFICATION' }

type NotificationReducerActions = SetNotificationAction | RemoveNotificationAction

/**
 * Handles the dispatched actions to update the notification to the Redux state.
 */
const notificationReducer = (
  state = initialState, action: NotificationReducerActions,
): NotificationReducerState => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return { message: action.payload.message, type: action.payload.type };
    case 'REMOVE_NOTIFICATION':
      return { ...state, message: '' };
    default:
      return state;
  }
};

/**
 * Dispatcher for setting the notification message.
 * @param message
 * @param type either 'error' or 'success'
 */
export const setNotificationAction = (
  message: string, type: NotificationType,
) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_NOTIFICATION',
    payload: { message, type },
  });
};

/**
 * Dispatcher for removing the notification message.
 */
export const removeNotificationAction = () => (dispatch: Dispatch): void => {
  dispatch({
    type: 'REMOVE_NOTIFICATION',
  });
};

export default notificationReducer;
