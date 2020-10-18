import axios from 'axios';

const baseUrl = '/api/alerts';

const getUserAlerts = async (user) => {
  const response = await axios
    .get(`${baseUrl}/${user.id}`);
  return response.data;
};

const create = async (variable, lowerLimit, upperLimit, user, email) => {
  const body = {variable, lowerLimit, upperLimit, user, email};
  const response = await axios.post(baseUrl, body);
  return response.data;
};

export default { getUserAlerts, create };