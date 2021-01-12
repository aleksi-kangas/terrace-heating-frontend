import heatPumpService from '../services/heatPump';

/**
 * Handles the dispatched actions to update the heat-pump data of the Redux state.
 */
const circuitReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_CIRCUITS':
      return action.payload;
    default:
      return state;
  }
};

export const fetchActiveCircuits = () => async (dispatch) => {
  const data = await heatPumpService.getActiveCircuits();
  dispatch({
    type: 'SET_ACTIVE_CIRCUITS',
    payload: data,
  });
};

export const setActiveCircuits = (activeCircuits) => (dispatch) => {
  dispatch({
    type: 'SET_ACTIVE_CIRCUITS',
    payload: activeCircuits,
  });
};

export default circuitReducer;
