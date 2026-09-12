const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'carpool.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    vehicle_info TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    days TEXT NOT NULL,
    time TEXT NOT NULL,
    seats_total INTEGER NOT NULL,
    seats_available INTEGER NOT NULL
  )
`);

module.exports = db;
