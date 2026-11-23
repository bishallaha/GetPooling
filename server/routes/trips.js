const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/trips?origin=&destination=&day=&driver_phone=
router.get('/', (req, res) => {
  // Trim so a trailing space from phone autocomplete doesn't hide matches;
  // a repeated param arrives as an array, treat it as missing
  const clean = (value) => (typeof value === 'string' ? value.trim() : '');
  const origin = clean(req.query.origin);
  const destination = clean(req.query.destination);
  const day = clean(req.query.day);
  const driverPhone = clean(req.query.driver_phone);

  // Public list: never send the licence number itself, only whether one is on file
  let query = `
    SELECT id, driver_name, driver_phone, vehicle_info, origin, destination,
      days, time, seats_total, seats_available,
      license_number IS NOT NULL AS has_license
    FROM trips WHERE 1=1
  `;
  const params = [];

  if (origin) {
    query += ' AND origin LIKE ?';
    params.push(`%${origin}%`);
  }
  if (destination) {
    query += ' AND destination LIKE ?';
    params.push(`%${destination}%`);
  }
  if (day) {
    query += ' AND days LIKE ?';
    params.push(`%${day}%`);
  }
  if (driverPhone) {
    query += ' AND driver_phone = ?';
    params.push(driverPhone);
  }

  query += ' ORDER BY id DESC';

  try {
    const trips = db.prepare(query).all(...params);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// POST /api/trips
router.post('/', (req, res) => {
  const {
    driver_name,
    driver_phone,
    vehicle_info,
    origin,
    destination,
    days,
    time,
    seats,
    license_number
  } = req.body;

  if (
    !driver_name?.trim() ||
    !driver_phone?.trim() ||
    !vehicle_info?.trim() ||
    !origin?.trim() ||
    !destination?.trim() ||
    !days?.trim() ||
    !time
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const seatCount = Number(seats);

  if (!Number.isInteger(seatCount) || seatCount <= 0) {
    return res.status(400).json({ error: 'Seats must be a positive number' });
  }

  // ponytail: format check only, no real verification; add an upload/verify step if it ever matters
  const license = typeof license_number === 'string' ? license_number.trim().toUpperCase() : '';

  if (!/^[A-Z0-9 -]{5,20}$/.test(license)) {
    return res.status(400).json({ error: 'Enter a valid driving licence number (5-20 letters or numbers)' });
  }

  try {
    const duplicate = db.prepare(`
      SELECT id FROM trips
      WHERE driver_phone = ?
      AND origin = ?
      AND destination = ?
      AND days = ?
      AND time = ?
    `).get(
      driver_phone.trim(),
      origin.trim(),
      destination.trim(),
      days.trim(),
      time
    );

    if (duplicate) {
      return res.status(400).json({ error: 'This trip already exists' });
    }

    const result = db.prepare(`
      INSERT INTO trips (
        driver_name,
        driver_phone,
        vehicle_info,
        origin,
        destination,
        days,
        time,
        seats_total,
        seats_available,
        license_number
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      driver_name.trim(),
      driver_phone.trim(),
      vehicle_info.trim(),
      origin.trim(),
      destination.trim(),
      days.trim(),
      time,
      seatCount,
      seatCount,
      license
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      message: 'Trip posted successfully'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post trip' });
  }
});

module.exports = router;
