import axios from 'axios';
import moment from 'moment';

const baseUrl = '/api/heat-pump';

/**
 * Request heat-pump data for the given amount of days from the API.
 * Timestamp is defined by query strings: year, month and day.
 * @return [Object] array of heat-pump data entries
 */
const getHeatPumpData = async (days) => {
  const date = moment();
  date.subtract(days, 'days');
  const dateParts = date.format('YYYY-MM-DD').split('-');
  const response = await axios
    .get(`${baseUrl}/?year=${dateParts[0]}&month=${dateParts[1]}&day=${dateParts[2]}`, {
      withCredentials: true,
    });
  return response.data;
};

/**
 * Request the status of the heating from the API.
 * @return { Number }
 */
const getStatus = async () => {
  const response = await axios.get('/api/heat-pump/status', { withCredentials: true });
  return response.data;
};

/**
 * Start the heat distribution circuit three via API.
 * @param softStart boolean - should soft-start functionality be used
 */
const startCircuitThree = async (softStart) => {
  const data = {
    softStart,
  };
  const response = await axios.post('/api/heat-pump/start', data, { withCredentials: true });
  return response.data;
};

/**
 * Stop the heat distribution circuit three via API.
 */
const stopCircuitThree = async () => {
  const response = await axios.post('/api/heat-pump/stop', null, { withCredentials: true });
  return response.data;
};

/**
 * Request heating schedule of the given variable from the API.
 * @param variable either 'lowerTank' or 'heatDistCircuit3'
 * @return {Object} containing the heating schedule of the variable
 */
const getSchedule = async (variable) => {
  const response = await axios.get(`/api/heat-pump/schedules/${variable}`, { withCredentials: true });
  return response.data;
};

/**
 * Set heating schedule of the given variable via API.
 * @param variable either 'lowerTank' or 'heatDistCircuit3'
 * @param schedule object containing the schedule to set, e.g.
 * { monday: { start: Number, end: Number, delta: Number }, ... }
 */
const setSchedule = async (variable, schedule) => {
  const data = {
    schedule,
  };
  const response = await axios.post(`/api/heat-pump/schedules/${variable}`, data, { withCredentials: true });
  return response.data;
};

/**
 * Enable or disable scheduling via API.
 * @param schedulingEnable Boolean shall scheduling be enabled or not
 */
const setScheduling = async (schedulingEnable) => {
  const data = { scheduling: schedulingEnable };
  const response = await axios.post('/api/heat-pump/scheduling', data, { withCredentials: true });
  return response.data;
};

/**
 * Request the status of scheduling,
 * and current schedules for 'lowerTank' and 'heatDistCircuit3' from the API.
 * @return {Object} { scheduling: Boolean, lowerTank: {Object}, heatDistCircuit3: {Object} }
 */
const getScheduling = async () => {
  const response = await axios.get('/api/heat-pump/scheduling', { withCredentials: true });
  return response.data;
};

const HeatPumpService = {
  getHeatPumpData,
  getStatus,
  getSchedule,
  setSchedule,
  startCircuitThree,
  stopCircuitThree,
  setScheduling,
  getScheduling,
};

export default HeatPumpService;
