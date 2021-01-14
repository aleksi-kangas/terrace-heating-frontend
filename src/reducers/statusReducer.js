import heatPumpService from '../services/heatPump';

/**
 * Handles the dispatched actions to update the heat-pump data of the Redux state.
 */
const statusReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_STATUS':
      return action.payload;
    default:
      return state;
  }
};

/**
 * Action creator for fetching the status of the heating system.
 */
export const fetchStatus = () => async (dispatch) => {
  const data = await heatPumpService.getStatus();
  dispatch({
    type: 'SET_STATUS',
    payload: data.status,
  });
};

/**
 * Action creator for updating the state with the status of the heating system.
 * @param status Object { status: 'running' || 'boosting' || 'softStart' || 'stopped' }
 */
export const setStatus = (status) => (dispatch) => {
  dispatch({
    type: 'SET_STATUS',
    payload: status.status,
  });
};

export default statusReducer;
