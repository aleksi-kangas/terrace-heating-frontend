import axios from 'axios';

const baseUrl = '/api/auth';

/**
 * Enables login functionality with credentials.
 * @param userCredentials {username, password}
 * @return {Object} user
 */

const login = async (userCredentials) => {
  const response = await axios.post(`${baseUrl}/login`, userCredentials);
  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${baseUrl}/logout`);
  return response.data;
};

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
