import heatPumpService from '../services/heatPump';

/**
 * Handles the dispatched actions to update the heat-pump data of the Redux state.
 */
const scheduleReducer = (state = null, action) => {
  switch (action.type) {
    case 'INIT_SCHEDULE':
      return action.payload;
    case 'UPDATE_SCHEDULING':
      return { state, ...action.payload };
    case 'UPDATE_SCHEDULE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

/**
 * Action creator for initializing scheduling and schedules for 'lowerTank' and 'heatDistCircuit3'.
 */
export const initializeSchedules = () => async (dispatch) => {
  const schedules = await heatPumpService.getScheduling();
  dispatch({
    type: 'INIT_SCHEDULE',
    payload: schedules,
  });
};

/**
 * Action creator for updating active scheduling to the Redux state.
 * @param scheduling Boolean
 */
export const updateScheduling = (scheduling) => (dispatch) => {
  dispatch({
    type: 'UPDATE_SCHEDULING',
    payload: { scheduling },
  });
};

/**
 * Action creator for updating the schedule of either 'lowerTank' or 'heatDistCircuit3'
 * to the Redux state.
 * @param variable either 'lowerTank' or 'heatDistCircuit3'
 * @param schedule Object containing schedule
 */
export const updateSchedule = (variable, schedule) => (dispatch) => {
  dispatch({
    type: 'UPDATE_SCHEDULE',
    payload: { [variable]: schedule },
  });
};

export default scheduleReducer;
