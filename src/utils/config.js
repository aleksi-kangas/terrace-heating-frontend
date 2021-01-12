import dotenv from 'dotenv';

// Load .env file contents to process.env
dotenv.config();

const config = {
  SOCKET_IO_URL: process.env.SOCKET_IO_URL,
};

export default config;
