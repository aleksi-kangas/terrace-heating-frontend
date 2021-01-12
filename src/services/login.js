import axios from 'axios';

const baseUrl = '/api/login';

/**
 * Enables login functionality with credentials.
 * @param userCredentials {username, password}
 * @return {Object} user
 */
const login = async (userCredentials) => {
  const response = await axios.post(baseUrl, userCredentials);
  return response.data;
};

const LoginService = { login };

export default LoginService;
