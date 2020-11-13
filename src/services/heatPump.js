import axios from 'axios';
import moment from 'moment';

const baseUrl = '/api/heat-pump';

const getLastWeek = async () => {
  const date = moment();
  date.subtract(1, 'week');
  const dateParts = date.format('YYYY-MM-DD').split('-');
  const response = await axios
    .get(`${baseUrl}/?year=${dateParts[0]}&month=${dateParts[1]}&day=${dateParts[2]}`);
  return response.data;
};

const getActiveCircuits = async () => {
  const response = await axios.get('/api/heat-pump/circuits');
  return response.data;
};

const toggleCircuitThree = async (activeCircuits) => {
  const response = await axios.post(`/api/heat-pump/circuits/?active=${activeCircuits}`);
  return response.data;
};

export default { getLastWeek, getActiveCircuits, toggleCircuitThree }