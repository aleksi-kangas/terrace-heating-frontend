import axios from 'axios';

const baseUrl = '/api/logout';

/**
 * Enables with credentials. Server deleted http-only cookie.
 */
const logout = async () => {
  const response = await axios.post(baseUrl);
  return response.data;
};

const LogoutService = { logout };

export default LogoutService;
