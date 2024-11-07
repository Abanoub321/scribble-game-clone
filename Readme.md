# Scribble Game

Scribble Game is a real-time multiplayer drawing and guessing game built using React and Socket.IO. Players take turns drawing a word while others try to guess it.

## Features

- Real-time drawing and guessing
- Turn-based game play
- Word guessing with feedback
- Clear canvas functionality
- User-friendly interface

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abanoub321/scribble-game-clone.git
   cd scribble-game-clone
   ```

2. Install dependencies for both client and server:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

### Running the Application

1. Start the server:

   ```bash
   cd server
   npm start
   ```

2. Start the client:

   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to start playing.

## Project Structure

- `client/`: Contains the React frontend code
  - `src/components/`: React components for the game
  - `src/App.tsx`: Main application component
  - `src/App.css`: Styles for the application

- `server/`: Contains the Node.js backend code
  - `src/index.ts`: Server setup and configuration
  - `src/socket.ts`: Socket.IO connection handling
  - `src/game.ts`: Game logic and state management
  - `src/utils.ts`: Utility functions

## Credits

This application was developed with the help of [Cursor](https://www.cursor.so/), an AI-powered code editor that assists in writing and refactoring code efficiently.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.