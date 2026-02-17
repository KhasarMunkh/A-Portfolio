# Tetris DUEL

A real-time 1v1 multiplayer Tetris game with ELO-based matchmaking and leaderboards. Built with an authoritative server architecture — the server runs all game logic and broadcasts state to both players via WebSockets.

## Features

- **Real-time 1v1 matches** — FIFO matchmaking queue pairs players instantly
- **Authoritative server** — all game logic runs server-side to prevent cheating
- **ELO ranking system** — K=32 standard ELO with persistent ratings across matches
- **Garbage attacks** — clearing 2+ lines sends `cleared - 1` garbage rows to your opponent
- **Ghost piece** — semi-transparent preview showing where your piece will land
- **Hold piece** — press C to stash a piece for later
- **5-piece lookahead** — see the next 3 pieces in your queue
- **DAS/ARR** — Delayed Auto Shift (150ms) and Auto Repeat Rate (30ms) for responsive movement
- **SRS rotation** — standard Super Rotation System with wall kick tables
- **Leaderboard** — top 10 players with ELO, wins, and losses

## Controls

| Action       | Key                        |
|--------------|----------------------------|
| Move Left    | `A` / `Arrow Left`         |
| Move Right   | `D` / `Arrow Right`        |
| Soft Drop    | `S` / `Arrow Down`         |
| Rotate CW    | `W` / `Arrow Up`           |
| Hard Drop    | `Space`                    |
| Hold Piece   | `C`                        |

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 19, TypeScript, Tailwind CSS 4, Vite 7 |
| Backend    | Node.js, Express, Socket.IO                 |
| Database   | MongoDB (Mongoose ODM)                      |
| Deployment | Docker, docker-compose                      |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local instance or Atlas connection string)

### Setup

```bash
git clone https://github.com/your-username/multiplayer-tetris.git
cd multiplayer-tetris
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB connection string:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tetris
```

### Development

Run the backend and frontend in separate terminals:

```bash
npm run dev:server   # Express + Socket.IO on port 3000
npm run dev:client   # Vite dev server on port 5173 (proxies API/WS to backend)
```

Open http://localhost:5173 in two browser tabs, enter usernames, and hit Play.

### Production

```bash
npm run build   # Type-check + bundle frontend into dist/
npm start       # Serves the app on port 3000
```

### Docker

Run the full stack (app + MongoDB) with a single command:

```bash
docker compose up --build
```

This starts the app on port 3000 with a MongoDB 7 instance. Data is persisted in a named volume.

## Project Structure

```
├── server.js                 # Express + Socket.IO server, game loop, matchmaking
├── Player.js                 # Server-side player state (board, tetromino, score, garbage)
├── Board.js                  # Server-side grid logic and collision detection
├── Tetromino.js              # Server-side piece movement and SRS rotation
├── TetrominoShapes.js        # Piece definitions and color palette
├── models/
│   └── User.js               # Mongoose schema with ELO calculation
├── src/
│   ├── App.tsx               # Root component with screen routing
│   ├── main.tsx              # React entry point
│   ├── style.css             # Tailwind CSS base styles
│   ├── types.ts              # Shared TypeScript types for socket packets
│   ├── hooks/
│   │   ├── useGame.ts        # Game state management and socket event handling
│   │   └── useSocket.ts      # Socket.IO connection singleton
│   ├── classes/
│   │   ├── Board.ts          # Client-side board rendering
│   │   ├── Tetromino.ts      # Client-side piece rendering and ghost calculation
│   │   └── TetrominoShapes.ts# Piece shapes and color palette
│   └── components/
│       ├── game/
│       │   └── GameCanvas.tsx # Canvas rendering, keyboard input, DAS/ARR
│       └── screens/
│           ├── MenuScreen.tsx
│           ├── QueueScreen.tsx
│           ├── GameScreen.tsx
│           ├── GameOverScreen.tsx
│           └── LeaderboardScreen.tsx
├── Dockerfile                # Multi-stage build (builder → production)
├── docker-compose.yml        # App + MongoDB 7 with health checks
└── vite.config.ts            # Dev proxy for API and WebSocket
```

## Architecture

```
┌─────────────┐  Socket.IO  ┌──────────────────────┐  Mongoose  ┌─────────┐
│  React SPA  │◄───────────►│  Node.js Server      │◄──────────►│ MongoDB │
│  (Canvas)   │  update/    │  - Game loop (500ms)  │            │         │
│             │  input      │  - Matchmaking queue  │            │  Users  │
└─────────────┘             │  - Collision/scoring  │            │  (ELO)  │
                            └──────────────────────┘            └─────────┘
```

The server is the single source of truth. Clients send input operations (`L`, `R`, `D`, `CW`, `HD`, `H`) and receive the full game state on every tick and after every input. This authoritative model means the client is purely a renderer — it never computes game logic.

### Socket Events

| Event        | Direction         | Payload                                    |
|--------------|-------------------|--------------------------------------------|
| `queueMatch` | Client → Server   | Username string                            |
| `startGame`  | Server → Client   | Initial boards, tetrominoes, and queues    |
| `input`      | Client → Server   | `{ op, seq }` — operation + sequence number |
| `update`     | Server → Client   | Full state for both players                |
| `gameOver`   | Server → Client   | Winner ID and final scores                 |

### REST API

| Endpoint                      | Description                                |
|-------------------------------|--------------------------------------------|
| `GET /api/leaderboard/:username` | Top 10 players + requesting user's rank |

## Available Scripts

| Command             | Description                                         |
|---------------------|-----------------------------------------------------|
| `npm run dev:server`| Run backend with `--watch` for auto-reload          |
| `npm run dev:client`| Run Vite dev server with HMR                        |
| `npm run build`     | Type-check and build frontend for production        |
| `npm run typecheck` | Run TypeScript type checking only                   |
| `npm start`         | Run production server (serves from `dist/`)         |
| `npm run preview`   | Preview production build locally via Vite           |

## License

MIT
