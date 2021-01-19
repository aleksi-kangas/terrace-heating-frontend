import io from 'socket.io-client';

const socket = io('ws://localhost:3003', { transports: ['websocket'] });

const socketAuth = () => {
  socket.io.disconnect();
  socket.io.open();
};

export { socket, socketAuth };
