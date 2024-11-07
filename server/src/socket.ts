import { Server, Socket } from 'socket.io';
import { startNewRound, handleGuess, handleDraw, handleClearCanvas, handleDisconnect } from './game';

export function handleSocketConnection(io: Server, socket: Socket) {
  console.log('User connected:', socket.id);

  socket.on('setUsername', (username: string) => {
    io.emit('message', {
      username: 'System',
      text: `${username} joined the game`,
      type: 'system'
    });

    if (!startNewRound(io)) {
      startNewRound(io);
    }
  });

  socket.on('draw', (data) => handleDraw(io, socket, data));
  socket.on('clearCanvas', () => handleClearCanvas(io, socket));
  socket.on('guess', (data) => handleGuess(io, socket, data));
  socket.on('disconnect', () => handleDisconnect(io, socket));
} 