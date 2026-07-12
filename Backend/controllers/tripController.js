const db = require('../config/db');

exports.getTrips = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM trips';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC';

    const [trips] = await db.execute(query, params);
    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /trips - Create a draft trip
exports.createTrip = async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status } = req.body;
  try {
    const tripStatus = status || 'Draft';

    const [vehicleRows] = await db.execute('SELECT id, status, max_load_capacity FROM vehicles WHERE id = ?', [vehicle_id]);
    if (vehicleRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected vehicle was not found.' });
    }
    if (vehicleRows[0].status !== 'Available') {
      return res.status(409).json({ success: false, message: 'Selected vehicle is not available for dispatch.' });
    }
    if (cargo_weight > vehicleRows[0].max_load_capacity) {
      return res.status(400).json({ success: false, message: 'Cargo weight exceeds the vehicle max load capacity.' });
    }

    const [driverRows] = await db.execute('SELECT id, status, license_expiry_date FROM drivers WHERE id = ?', [driver_id]);
    if (driverRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected driver was not found.' });
    }
    if (driverRows[0].status !== 'Available') {
      return res.status(409).json({ success: false, message: 'Selected driver is not available for dispatch.' });
    }
    const expiry = new Date(driverRows[0].license_expiry_date);
    if (Number.isFinite(expiry.getTime()) && expiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Selected driver license is expired.' });
    }

    const [result] = await db.execute(
      'INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, tripStatus]
    );
    const [rows] = await db.execute('SELECT * FROM trips WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    const message = err?.message || 'Unable to create trip';
    res.status(500).json({ success: false, message });
  }
};

// PUT /trips/:id/dispatch - Start the trip
exports.dispatchTrip = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [tripRows] = await connection.execute('SELECT vehicle_id, driver_id, status FROM trips WHERE id = ?', [id]);
    if (tripRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }
    if (tripRows[0].status !== 'Draft') {
      await connection.rollback();
      return res.status(409).json({ success: false, message: 'Only draft trips can be dispatched.' });
    }

    const [vehicleRows] = await connection.execute('SELECT id, status FROM vehicles WHERE id = ?', [tripRows[0].vehicle_id]);
    const [driverRows] = await connection.execute('SELECT id, status, license_expiry_date FROM drivers WHERE id = ?', [tripRows[0].driver_id]);

    if (vehicleRows.length === 0 || driverRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Assigned vehicle or driver could not be found.' });
    }
    if (vehicleRows[0].status !== 'Available' || driverRows[0].status !== 'Available') {
      await connection.rollback();
      return res.status(409).json({ success: false, message: 'Vehicle or driver is no longer available.' });
    }

    const expiry = new Date(driverRows[0].license_expiry_date);
    if (Number.isFinite(expiry.getTime()) && expiry < new Date()) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Driver license is expired.' });
    }

    await connection.execute('UPDATE trips SET status = "Dispatched", dispatched_at = NOW() WHERE id = ?', [id]);
    await connection.execute('UPDATE vehicles SET status = "On Trip" WHERE id = ?', [tripRows[0].vehicle_id]);
    await connection.execute('UPDATE drivers SET status = "On Trip" WHERE id = ?', [tripRows[0].driver_id]);

    await connection.commit();
    res.json({ success: true, message: 'Trip dispatched successfully' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

// PUT /trips/:id/complete - Finish the trip
exports.completeTrip = async (req, res) => {
  const { id } = req.params;
  const { actual_distance, fuel_consumed } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE trips SET status = "Completed", completed_at = NOW(), actual_distance = ?, fuel_consumed = ? WHERE id = ?',
      [actual_distance, fuel_consumed, id]
    );

    const [trip] = await connection.execute('SELECT vehicle_id, driver_id FROM trips WHERE id = ?', [id]);
    await connection.execute('UPDATE vehicles SET status = "Available" WHERE id = ?', [trip[0].vehicle_id]);
    await connection.execute('UPDATE drivers SET status = "Available" WHERE id = ?', [trip[0].driver_id]);

    await connection.commit();
    res.json({ success: true, message: 'Trip completed' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

// PUT /trips/:id/cancel
exports.cancelTrip = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE trips SET status = "Cancelled" WHERE id = ?', [id]);
    res.json({ success: true, message: 'Trip cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};