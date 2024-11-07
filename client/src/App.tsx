import React, { useEffect, useState } from 'react';
import './App.css';
import DrawingCanvas from './components/DrawingCanvas';
import ChatBox from './components/ChatBox';
import { io, Socket } from 'socket.io-client';

interface GameState {
  currentDrawer: string;
  currentWord: string;
  isDrawing: boolean;
  timeLeft: number;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentDrawer: '',
    currentWord: '',
    isDrawing: false,
    timeLeft: 60,
  });

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('gameState', (state: GameState) => {
      setGameState(state);
      console.log(state);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const isDrawing = gameState.currentDrawer === socket?.id;

  return (
    <div className="App">
      <div className="game-container">
        <h1>Scribble Game</h1>
        {isDrawing && <div className="word-display">Word to draw: {gameState.currentWord}</div>}
        {!isDrawing && <div className="word-display">Guess the word!</div>}
        <div className="game-area">
          {socket && <DrawingCanvas socket={socket} isEnabled={isDrawing} />}
          {socket && <ChatBox socket={socket} username={username} isCurrentDrawer={isDrawing} />}
        </div>
        {!isUsernameSet && (
          <div className="username-prompt">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={() => { socket?.emit('setUsername', username); setIsUsernameSet(true); }}>Set Username</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
