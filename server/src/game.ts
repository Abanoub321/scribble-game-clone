import { Server, Socket } from 'socket.io';
import { selectNewWord } from './utils';

let currentWord = '';
let currentDrawer: string | null = null;
let players = new Map<string, string>(); // socketId -> username
let currentDrawing: { x: number; y: number; drawing: boolean }[] = [];

export function startNewRound(io: Server): boolean {
  currentWord = selectNewWord();
  currentDrawing = [];
  const connectedSockets = Array.from(io.sockets.sockets.keys());
  if (connectedSockets.length > 0) {
    currentDrawer = connectedSockets[Math.floor(Math.random() * connectedSockets.length)];
    io.emit('gameState', {
      currentDrawer,
      currentWord: currentDrawer ? currentWord : '',
      isDrawing: true,
      timeLeft: 60
    });
    return true;
  } else {
    currentDrawer = null;
    return false;
  }
}

export function handleDraw(io: Server, socket: Socket, data: { x: number; y: number; drawing: boolean }) {
  if (socket.id === currentDrawer) {
    currentDrawing.push(data);
    socket.broadcast.emit('draw', data);
  }
}

export function handleClearCanvas(io: Server, socket: Socket) {
  if (socket.id === currentDrawer) {
    currentDrawing = [];
    io.emit('clearCanvas');
  }
}

export function handleGuess(io: Server, socket: Socket, { username, guess }: { username: string; guess: string }) {
  if (socket.id !== currentDrawer && guess.toLowerCase() === currentWord.toLowerCase()) {
    io.emit('correctGuess', username);
    setTimeout(() => {
      io.emit('gameState', {
        currentDrawer,
        currentWord: '',
        isDrawing: true,
        timeLeft: 60
      });
      setTimeout(() => {
        startNewRound(io);
      }, 2000);
    }, 2000);
  } else {
    io.emit('message', {
      username,
      text: guess,
      type: 'guess'
    });
  }
}

export function handleDisconnect(io: Server, socket: Socket) {
  const username = players.get(socket.id);
  if (username) {
    io.emit('message', {
      username: 'System',
      text: `${username} left the game`,
      type: 'system'
    });
    players.delete(socket.id);
  }

  if (socket.id === currentDrawer) {
    currentDrawing = [];
    startNewRound(io);
  }
} 