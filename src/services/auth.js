import axios from 'axios';

const baseUrl = '/api/auth';

/**
 * Enables login functionality with credentials.
 * Sends the action to the server.
 * @param userCredentials {username, password}
 * @return {Object} user
 */
const login = async (userCredentials) => {
  const response = await axios.post(`${baseUrl}/login`, userCredentials);
  return response.data;
};

/**
 * Enables logout functionality.
 * Sends the action to the server.
 */
const logout = async () => {
  const response = await axios.post(`${baseUrl}/logout`);
  return response.data;
};

/**
 * Enables fetching user session from the server.
 */
const fetchAuth = async () => {
  try {
    const response = await axios.get(`${baseUrl}/session`);
    return response.data;
  } catch (error) {
    return null;
  }
};

const AuthService = { login, logout, fetchAuth };

export default AuthService;
