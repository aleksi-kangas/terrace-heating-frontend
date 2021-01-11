import axios from 'axios';
import moment from 'moment';

// Authorization
let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`
};

const getConfig = () => {
  return {
    headers: { Authorization: token }
  }
};

const baseUrl = '/api/heat-pump';

const getLastWeek = async () => {
  const date = moment();
  date.subtract(1, 'week');
  const dateParts = date.format('YYYY-MM-DD').split('-');
  const response = await axios
    .get(`${baseUrl}/?year=${dateParts[0]}&month=${dateParts[1]}&day=${dateParts[2]}`, getConfig());
  return response.data;
};

const getActiveCircuits = async () => {
  const response = await axios.get('/api/heat-pump/circuits', getConfig());
  return response.data;
};

const startCircuitThree = async (softStart) => {
  const data = {
    softStart
  };
  const response = await axios.post(`/api/heat-pump/start`, data, getConfig());
  return response.data;
};

const stopCircuitThree = async () => {
  const response = await axios.post(`/api/heat-pump/stop`, null, getConfig());
  return response.data;
};

const getSchedule = async (variable) => {
  const response = await axios.get(`/api/heat-pump/schedules/${variable}`, getConfig());
  return response.data;
};

const setSchedule = async (variable, schedule) => {
  const data = {
    variable,
    schedule
  };
  const response = await axios.post(`/api/heat-pump/schedules`, data, getConfig());
  return response.data;
};

const HeatPumpService = {
  getLastWeek, getActiveCircuits, getSchedule, setSchedule, setToken, startCircuitThree, stopCircuitThree,
};

export default HeatPumpService;
