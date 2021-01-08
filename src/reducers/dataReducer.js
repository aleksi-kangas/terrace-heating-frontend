import heatPumpService from '../services/heatPump.js';

const dataReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
    default:
      return state;
  }
};

export const initializeData = () => {
  return async dispatch => {
    const data = await heatPumpService.getLastWeek();
    dispatch({
      type: 'SET_DATA',
      payload: data
    })
  }
};

export const setData = (data) => {
  return dispatch => {
    dispatch({
      type: 'SET_DATA',
      payload: data
    });
  }
};

export default dataReducer;
