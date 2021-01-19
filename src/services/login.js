import axios from 'axios';
import { socketAuth } from '../utils/socket';

const baseUrl = '/api/login';

/**
 * Enables login functionality with credentials.
 * @param userCredentials {username, password}
 * @return {Object} user
 */
const login = async (userCredentials) => {
  const response = await axios.post(baseUrl, userCredentials);
  if (response.status === 200) {
    socketAuth();
  }
  return response.data;
};

const LoginService = { login };

export default LoginService;
