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

module.exports = router;
