import heatPumpService from '../services/heatPump.js';

/**
 * Handles the dispatched actions to update the heat-pump data of the Redux state.
 */
const scheduleReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_SCHEDULE':
      const variable = action.variable;
      return { [variable]: action.payload, ...state };
    default:
      return state;
  }
};

export const fetchSchedule = (variable) => {
  return async dispatch => {
    const data = await heatPumpService.getSchedule(variable);
    dispatch({
      type: 'SET_SCHEDULE',
      variable: variable,
      payload: data
    })
  }
};

export const setSchedule = (variable, schedule) => {
  return dispatch => {
    dispatch({
      type: 'SET_SCHEDULE',
      variable: variable,
      payload: schedule
    })
  }
};

export default scheduleReducer;
