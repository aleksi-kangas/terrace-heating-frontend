import heatPumpService from '../services/heatPump';

/**
 * Handles the dispatched actions to update the heat-pump data of the Redux state.
 */
const scheduleReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_SCHEDULE':
      return { [action.variable]: action.payload, ...state };
    default:
      return state;
  }
};

export const fetchSchedule = (variable) => async (dispatch) => {
  const data = await heatPumpService.getSchedule(variable);
  dispatch({
    type: 'SET_SCHEDULE',
    variable,
    payload: data,
  });
};

export const setSchedule = (variable, schedule) => (dispatch) => {
  dispatch({
    type: 'SET_SCHEDULE',
    variable,
    payload: schedule,
  });
};

export default scheduleReducer;
