import axios from 'axios';
import moment from 'moment';

// Authorization (bearer) token
let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`
};

/**
 * Create authorization configuration object for API requests.
 * @return {Object} object containing authorization-header
 */
const getConfig = () => {
  return {
    headers: { Authorization: token }
  }
};

const baseUrl = '/api/heat-pump';

/**
 * Request heat-pump data from a given date onwards from the API.
 * Timestamp is defined by query strings: year, month and day.
 * @return [Object] array of heat-pump data entries
 */
const getHeatPumpData = async () => {
  const date = moment();
  date.subtract(1, 'week');
  const dateParts = date.format('YYYY-MM-DD').split('-');
  const response = await axios
    .get(`${baseUrl}/?year=${dateParts[0]}&month=${dateParts[1]}&day=${dateParts[2]}`, getConfig());
  return response.data;
};

/**
 * Request the number of active heat distribution circuits from the API.
 * @return { Number }
 */
const getActiveCircuits = async () => {
  const response = await axios.get('/api/heat-pump/circuits', getConfig());
  return response.data;
};

/**
 * Start the heat distribution circuit three via API.
 * @param softStart boolean - should soft-start functionality be used
 */
const startCircuitThree = async (softStart) => {
  const data = {
    softStart
  };
  const response = await axios.post(`/api/heat-pump/start`, data, getConfig());
  return response.data;
};

/**
 * Stop the heat distribution circuit three via API.
 */
const stopCircuitThree = async () => {
  const response = await axios.post(`/api/heat-pump/stop`, null, getConfig());
  return response.data;
};

/**
 * Request heating schedule of the given variable from the API.
 * @param variable either 'lowerTank' or 'heatDistCircuit3'
 * @return {Object} containing the heating schedule of the variable
 */
const getSchedule = async (variable) => {
  const response = await axios.get(`/api/heat-pump/schedules/${variable}`, getConfig());
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
    variable,
    schedule
  };
  const response = await axios.post(`/api/heat-pump/schedules`, data, getConfig());
  return response.data;
};

const HeatPumpService = {
  getHeatPumpData, getActiveCircuits, getSchedule, setSchedule, setToken, startCircuitThree, stopCircuitThree,
};

export default HeatPumpService;
