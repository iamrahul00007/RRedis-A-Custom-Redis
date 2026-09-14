# RRedis-A-Custom-Redis
A real world and important backend's piece which need to make a system scalable and flexible....
# Custom Redis Server

A minimal Redis server built from scratch in Node.js, using raw TCP sockets and the RESP (REdis Serialization Protocol) to handle real `redis-cli` connections.

## Overview

This project implements a small subset of Redis's server behavior to understand how Redis works under the hood — accepting TCP connections, parsing the RESP protocol, and responding with correctly formatted RESP replies.

## Features

- TCP server built with Node's built-in `net` module
- RESP protocol parsing via [`redis-parser`](https://www.npmjs.com/package/redis-parser)
- In-memory key-value store
- Supported commands:
  - `SET key value`
  - `GET key`
- Connects and works with the real `redis-cli` client

## Tech Stack

- Node.js
- [`redis-parser`](https://www.npmjs.com/package/redis-parser) — parses incoming RESP data into command arrays

## Getting Started

### Prerequisites

- Node.js installed
- `redis-cli` (comes with Redis, or install via WSL/Linux package manager) to test the server

### Installation

```bash
git clone <your-repo-url>
cd <repo-folder>
npm install
```

### Running the Server

```bash
node index.js
```

You should see:

```
Custom Redis Server running on port 6378...
```

### Connecting with redis-cli

In a separate terminal:

```bash
redis-cli -h 127.0.0.1 -p 6378
```

Then try:

```
127.0.0.1:6378> set name Rahul
OK
127.0.0.1:6378> get name
"Rahul"
```

## How It Works

1. `net.createServer()` opens a TCP server and listens for client connections.
2. On each incoming `data` event, the raw buffer is passed to a `redis-parser` instance.
3. The parser converts the raw RESP bytes into a plain JS array, e.g. `['set', 'name', 'Rahul']`.
4. A `switch` statement dispatches based on the command name (`set` / `get`) and writes a RESP-formatted reply back to the client:
   - Simple strings: `+OK\r\n`
   - Bulk strings: `$<length>\r\n<value>\r\n`
   - Null bulk string: `$-1\r\n`
   - Errors: `-ERR <message>\r\n`

## Project Structure

```
.
├── index.js      # Server implementation
└── README.md
```

## Future Improvements

- Add more commands (`DEL`, `EXISTS`, `EXPIRE`, `INCR`, etc.)
- Add TTL/expiry support for keys
- Persist the store to disk
- Handle multiple commands pipelined in a single `data` event

## License

MIT
