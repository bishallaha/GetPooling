const express = require('express');
const db = require('../db');

const router = express.Router();


// POST /api/trips/:id/requests
// Rider sends a request to join a trip
router.post('/trips/:id/requests', (req, res) => {
  const tripId = Number(req.params.id);
  const { rider_name, rider_phone } = req.body;

  // Check required fields
  if (!rider_name?.trim() || !rider_phone?.trim()) {
    return res.status(400).json({
      error: 'Rider name and phone are required'
    });
  }

  try {
    // Check whether the trip exists
    const trip = db.prepare(`
      SELECT * FROM trips WHERE id = ?
    `).get(tripId);

    if (!trip) {
      return res.status(404).json({
        error: 'Trip not found'
      });
    }

    // Check whether a seat is available
    if (trip.seats_available <= 0) {
      return res.status(400).json({
        error: 'No seats available'
      });
    }

    // Create the join request
    const result = db.prepare(`
      INSERT INTO join_requests (
        trip_id,
        rider_name,
        rider_phone,
        status
      )
      VALUES (?, ?, ?, 'pending')
    `).run(
      tripId,
      rider_name.trim(),
      rider_phone.trim()
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      trip_id: tripId,
      rider_name: rider_name.trim(),
      status: 'pending',
      message: 'Join request sent'
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Failed to create join request'
    });
  }
});


// PATCH /api/requests/:id
// Driver approves or rejects a request
router.patch('/requests/:id', (req, res) => {
  const requestId = Number(req.params.id);
  const { status } = req.body;

  // Only allow these two statuses
  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({
      error: 'Status must be approved or rejected'
    });
  }

  try {
    // Find the request
    const request = db.prepare(`
      SELECT * FROM join_requests WHERE id = ?
    `).get(requestId);

    if (!request) {
      return res.status(404).json({
        error: 'Join request not found'
      });
    }

    // Request can only be processed once
    if (request.status !== 'pending') {
      return res.status(400).json({
        error: 'This request has already been processed'
      });
    }

    // If approved, reduce available seats
    if (status === 'approved') {
      const trip = db.prepare(`
        SELECT * FROM trips WHERE id = ?
      `).get(request.trip_id);

      if (!trip) {
        return res.status(404).json({
          error: 'Trip not found'
        });
      }

      if (trip.seats_available <= 0) {
        return res.status(400).json({
          error: 'No seats available'
        });
      }

      db.prepare(`
        UPDATE trips
        SET seats_available = seats_available - 1
        WHERE id = ?
      `).run(request.trip_id);
    }

    // Update request status
    db.prepare(`
      UPDATE join_requests
      SET status = ?
      WHERE id = ?
    `).run(status, requestId);

    res.json({
      id: requestId,
      status: status,
      message: `Request ${status}`
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Failed to update join request'
    });
  }
});


module.exports = router;