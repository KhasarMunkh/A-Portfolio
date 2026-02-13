# Termfolio

A portfolio website that drops visitors into an interactive Linux terminal running in their browser. Instead of clicking through pages, visitors type commands like `about`, `skills`, and `projects` to learn about you -- or open Neovim and browse your actual source code.

Each visitor gets their own sandboxed Docker container with a 15-minute session.

**Live:** [khasarmunkh.com](https://khasarmunkh.com/)

## How It Works

```
Browser (xterm.js)  <--WebSocket-->  Node.js Server  <--Docker API-->  Alpine Container
```

1. Visitor opens the page, xterm.js connects via WebSocket
2. Server spins up an isolated Docker container with a bash shell
3. Keystrokes flow from browser to container, terminal output flows back
4. Session auto-expires after 15 minutes, container is removed

## Features

- **Custom portfolio commands** -- `about`, `skills`, `projects`, `contact`
- **Real dev tools** -- Neovim (with Treesitter, Oil, mini.nvim), git, ripgrep, fd, bat, fzf, htop
- **Read-only project browsing** -- visitors can `cd ~/projects` and explore source code with Neovim
- **Sandboxed containers** -- no network access, 256MB memory limit, 50% CPU cap, max 50 PIDs
- **Catppuccin Macchiato** theme across the entire stack (HTML, xterm.js, bash, Neovim)
- **Up to 10 concurrent sessions**

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) 20+

## Quick Start

```bash
# Install dependencies
npm install

# Build the sandbox Docker image
npm run docker:build

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm run docker:build` | Build the sandbox container image |

## Production

```bash
docker compose up -d
```

This builds the app image, starts the server on port 3000, and mounts the Docker socket so the server can spawn sandbox containers.

For AWS deployment with Terraform and CI/CD, see [`terraform/README.md`](terraform/README.md).

## Project Structure

```
src/server.ts        # Express + WebSocket server, Docker container lifecycle
public/index.html    # xterm.js terminal client (single file, no build step)
sandbox/
  Dockerfile         # Alpine image with dev tools and portfolio commands
  welcome.sh         # ASCII art welcome screen
  profile.txt        # ANSI art profile picture
  nvim-config/       # Neovim config (Treesitter, Oil, mini.nvim)
terraform/           # AWS infrastructure (EC2, Caddy, Route53)
```

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `PROJECTS_PATH` | `../projects` | Host path mounted read-only into containers at `~/projects` |

To showcase your own projects, place or symlink repos into the `projects/` directory.

## Tech Stack

**Server:** Node.js, Express, ws, dockerode, TypeScript

**Client:** xterm.js, JetBrains Mono

**Sandbox:** Alpine Linux, bash, Neovim, ripgrep, fd, bat, fzf, git, Python, Go, Node.js

**Infrastructure:** Docker Compose, Terraform (AWS), Caddy, GitHub Actions
