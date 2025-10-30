# Zyra Chat App

**Zyra** is a modern, real-time chat platform built using TypeScript, React, WebSockets, and PostgreSQL — designed for speed, scalability, and simplicity.

## Screenshots

![App Screenshot](./home.png)

## Features

- Real-Time Chatting
- Read Receipts
- Search Users
- Offline Message Store
- Authentication
- HTTP-Only Cookies
- Beautiful Design

## Tech Stack

**Client:** React, Module css, jotai, Dexie, localForage

**Server1:** Node, Express, TypeScript

**Server2:** Express, Socket.IO

**DataBase:** Postgresql, Redis

**Deployment:** Caddy, Docker

## Installation

First clone project

```bash
git clone https://github.com/abdullah-rust/zyra.git
cd zyra
```

#### Run Docker Compose File

```bash
docker compose up -d
```

install dependancies

```bash
cd server1
pnpm install

# and go server2

cd server2
pnpm install

# go to zyra folder

cd zyra
pnpm install

```

#### Run sql file in Postgresql DataBase

Caddy File Setup

```bash
loclahost {
	handle_path /api/user/* {
        reverse_proxy localhost:4000
    }

    handle_path /api/chat/* {
        reverse_proxy localhost:4001
    }

     handle {
            reverse_proxy localhost:5173
    }
}

```

## Environment Variables

server1 .env file

```bash
PORT=4000
DATABASE_URL=postgresql://postgres:226622@localhost:5432/zyradb
EMAIL_PASS=app password
EMAIL_USER=your user email
JWT_SECRET=Abdullah226622
REFRESH_SECRET=Abdullah381a
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=Abdullah226622
MINIO_USE_SSL=false
```

server2 .env file

```bash
PORT=4001
JWT_SECRET=Abdullah226622
REFRESH_SECRET=Abdullah381a
REDIS_URL=redis://localhost:6379
```

### Run project

```bash
pnpm run dev
```

##

## System Architecture

Zyra uses a **microservice-inspired architecture**:

- **Server1 (REST API):** Handles user authentication, profiles, and persistence (PostgreSQL, Redis).
- **Server2 (WebSocket Service):** Handles real-time chat messages using Socket.IO.
- **Client:** React-based frontend that connects to both services.
- **Caddy:** Acts as a reverse proxy and load balancer for all services.
- **Docker Compose:** Used for containerized deployment.

```mermaid
flowchart TD
A[Client - React] -->|HTTP| B[Server1 - REST API]
A -->|WebSocket| C[Server2 - Socket.IO]
B --> D[(PostgreSQL)]
B --> E[(Redis)]
C --> E
B -->|Reverse Proxy| F[Caddy]
```

## Future Improvements

- Add typing indicators and message reactions
- End-to-end encryption for private chats
- Group chat and media sharing
- Improve offline syncing with IndexedDB
- Add mobile-optimized PWA version

## Author

👨‍💻 **Abdullah Riaz**  
Self-taught backend developer passionate about scalable architectures and clean design.  
📫 Reach me at: [ariaz7556@gmail.com](mailto:ariaz7556@gmail.com)

##

![GitHub Repo stars](https://img.shields.io/github/stars/abdullah-rust/zyra?style=flat)
![GitHub forks](https://img.shields.io/github/forks/abdullah-rust/zyra)
![License](https://img.shields.io/github/license/abdullah-rust/zyra)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
