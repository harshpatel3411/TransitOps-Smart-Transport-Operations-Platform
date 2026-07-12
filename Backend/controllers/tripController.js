const db = require('../config/db');

// POST /trips - Create a draft trip
exports.createTrip = async (req, res) => {
  const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status) VALUES (?, ?, ?, ?, ?, ?, "Draft")',
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /trips/:id/dispatch - Start the trip
exports.dispatchTrip = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Update Trip status
    await connection.execute('UPDATE trips SET status = "Dispatched", dispatched_at = NOW() WHERE id = ?', [id]);
    
    // Get IDs to update vehicle/driver
    const [trip] = await connection.execute('SELECT vehicle_id, driver_id FROM trips WHERE id = ?', [id]);
    
    // Update Vehicle and Driver status to "On Trip"
    await connection.execute('UPDATE vehicles SET status = "On Trip" WHERE id = ?', [trip[0].vehicle_id]);
    await connection.execute('UPDATE drivers SET status = "On Trip" WHERE id = ?', [trip[0].driver_id]);

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