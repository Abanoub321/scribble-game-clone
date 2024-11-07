import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface ChatBoxProps {
  socket: Socket;
  username: string;
  isCurrentDrawer: boolean;
}

interface Message {
  username: string;
  text: string;
  type: 'guess' | 'system' | 'correct';
}

const ChatBox: React.FC<ChatBoxProps> = ({ socket, username, isCurrentDrawer }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [guess, setGuess] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('correctGuess', (username: string) => {
      setMessages(prev => [...prev, {
        username: 'System',
        text: `${username} guessed the word correctly!`,
        type: 'correct'
      }]);
    });

    return () => {
      socket.off('message');
      socket.off('correctGuess');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      socket.emit('guess', { username, guess: guess.trim() });
      setGuess('');
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your guess..."
          disabled={!username || isCurrentDrawer}
        />
        <button type="submit" disabled={!username || isCurrentDrawer}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox; 