import heatPumpService from '../services/heatPump';

/**
 * Handles the dispatched actions to update the heat-pump data of the Redux state.
 */
const dataReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
    default:
      return state;
  }
};

/**
 * Action creator for initialing heat-pump data.
 * Used when data is received from the API the first time.
 */
export const initializeData = (dataTimePeriod) => async (dispatch) => {
  const data = await heatPumpService.getHeatPumpData(dataTimePeriod);
  dispatch({
    type: 'SET_DATA',
    payload: data,
  });
};

/**
 * Action creator for updating/overwriting the heat-pump data.
 * Used when real-time updates are received from the API.
 * @param data array of heat-pump data
 */
export const setData = (data) => (dispatch) => {
  dispatch({
    type: 'SET_DATA',
    payload: data,
  });
};

export default dataReducer;
