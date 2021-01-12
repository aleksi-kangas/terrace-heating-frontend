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
 * Dispatcher for initializing heat-pump data,
 * i.e. used when data is received from the API at the first time.
 */
export const initializeData = () => async (dispatch) => {
  const data = await heatPumpService.getHeatPumpData();
  dispatch({
    type: 'SET_DATA',
    payload: data,
  });
};

/**
 * Dispatcher for updating/overwriting the heat-pump data.
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
