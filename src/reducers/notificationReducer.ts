import { Dispatch } from 'redux';
import { NotificationType } from '../types';

/**
 * Types
 */

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
 * Redux reducer which handles application state related to notifications.
 * The state contains notification message and type.
 * @param state HeatPumpReducerState
 * @param action HeatPumpReducerActions
 */
const notificationReducer = (
  state: NotificationReducerState = initialState, action: NotificationReducerActions,
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
 * Action creator for writing new notification message and type to the state.
 * @param message string
 * @param type NotificationType
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
 * Action creator for clearing notification message from the state.
 */
export const removeNotificationAction = () => (dispatch: Dispatch): void => {
  dispatch({
    type: 'REMOVE_NOTIFICATION',
  });
};

export default notificationReducer;
