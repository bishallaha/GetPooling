// Temporary dummy data so the rider browse/search flow can be built and
// tested before Story 1 (driver posts a trip) exists.
// Run once with: node server/seed.js
// Remove/ignore once real trips are posted through Story 1's API.
const db = require('./db');

const seedTrips = [
  {
    driver_name: 'Rahul Sen',
    driver_phone: '9876543210',
    vehicle_info: 'Honda City, WB 06 AB 1234',
    origin: 'Salt Lake',
    destination: 'Park Street',
    days: 'Mon,Wed,Fri',
    time: '09:00',
    seats_total: 3,
    seats_available: 2,
  },
  {
    driver_name: 'Ananya Roy',
    driver_phone: '9123456780',
    vehicle_info: 'Hyundai i20, WB 04 CD 5678',
    origin: 'Howrah',
    destination: 'Sector V',
    days: 'Mon,Tue,Wed,Thu,Fri',
    time: '08:30',
    seats_total: 4,
    seats_available: 0,
  },
  {
    driver_name: 'Suresh Das',
    driver_phone: '9988776655',
    vehicle_info: 'Maruti Swift, WB 02 EF 9012',
    origin: 'Salt Lake',
    destination: 'Esplanade',
    days: 'Tue,Thu',
    time: '18:30',
    seats_total: 2,
    seats_available: 1,
  },
];

const insert = db.prepare(`
  INSERT INTO trips (driver_name, driver_phone, vehicle_info, origin, destination, days, time, seats_total, seats_available)
  VALUES (@driver_name, @driver_phone, @vehicle_info, @origin, @destination, @days, @time, @seats_total, @seats_available)
`);

const existing = db.prepare('SELECT COUNT(*) AS count FROM trips').get();

if (existing.count === 0) {
  seedTrips.forEach((trip) => insert.run(trip));
  console.log(`Seeded ${seedTrips.length} dummy trips.`);
} else {
  console.log('Trips table already has data, skipping seed.');
}
