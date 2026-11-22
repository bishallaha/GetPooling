# GetPooling

GetPooling is a simple carpooling web application that helps drivers and riders connect for shared journeys.

Drivers can post their trips, while riders can browse available trips and request to join them.

## Features

- Driver trip posting
- Browse available trips
- Rider join requests
- Driver approval or rejection of requests
- Available seat tracking
- Simple and clean user interface

## Tech Stack

- React
- Vite
- Node.js
- Express.js
- SQLite
- better-sqlite3
- HTML
- CSS
- JavaScript

## Project Structure

```text
GetPooling/
├── client/        # React frontend
└── server/        # Express backend and SQLite database
```

## Running the demo

```bash
# Terminal 1: API on http://localhost:3000
cd server && npm install && node seed.js && node index.js

# Terminal 2: app on http://localhost:5173
cd client && npm install && npm run dev
```

`node seed.js` adds three sample trips, but only when the database is empty.
To start fresh, delete `server/carpool.db` and run it again.
