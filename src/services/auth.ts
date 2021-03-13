import axios from 'axios';
import { Credentials, User } from '../types';

const baseUrl = '/api/auth';

type Session = {
  id: string,
  name: string,
  username: string
}

type AuthService = {
  login: (userCredentials: Credentials) => Promise<User>,
  logout: () => Promise<void>,
  fetchAuth: () => Promise<Session | null>
}

/**
 * Enables login functionality with credentials.
 * Sends the action to the server.
 * @param userCredentials {username, password}
 * @return {Object} user
 */
const login = async (userCredentials: { username: string, password: string }): Promise<User> => {
  const response = await axios.post(`${baseUrl}/login`, userCredentials);
  return response.data;
};

/**
 * Enables logout functionality.
 * Sends the action to the server.
 */
const logout = async (): Promise<void> => {
  const response = await axios.post(`${baseUrl}/logout`);
  return response.data;
};

/**
 * Enables fetching user session from the server.
 */
const fetchAuth = async (): Promise<Session | null> => {
  try {
    const response = await axios.get(`${baseUrl}/session`);
    return response.data;
  } catch (error) {
    return null;
  }
};

const AuthService: AuthService = { login, logout, fetchAuth };

export default AuthService;
