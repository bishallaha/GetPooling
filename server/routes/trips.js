const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/trips?origin=&destination=&day=
router.get('/', (req, res) => {
  const { origin, destination, day } = req.query;

  let query = 'SELECT * FROM trips WHERE 1=1';
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
    seats
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
        seats_available
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      driver_name.trim(),
      driver_phone.trim(),
      vehicle_info.trim(),
      origin.trim(),
      destination.trim(),
      days.trim(),
      time,
      seatCount,
      seatCount
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
