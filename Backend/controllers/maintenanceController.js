const db = require('../config/db');

// GET /maintenance
exports.getMaintenance = async (req, res) => {
  try {
    const [logs] = await db.execute('SELECT * FROM maintenance_logs');
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /maintenance
exports.addMaintenance = async (req, res) => {
  const { vehicle_id, description, cost, start_date } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO maintenance_logs (vehicle_id, description, cost, start_date, status) VALUES (?, ?, ?, ?, "Active")',
      [vehicle_id, description, cost, start_date]
    );
    // Optionally update vehicle status to 'In Shop'
    await db.execute('UPDATE vehicles SET status = "In Shop" WHERE id = ?', [vehicle_id]);
    
    res.status(201).json({ success: true, logId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /maintenance/:id/close
exports.closeMaintenance = async (req, res) => {
  const { id } = req.params;
  const { end_date } = req.body;
  try {
    // 1. Close the log
    await db.execute(
      'UPDATE maintenance_logs SET status = "Closed", end_date = ? WHERE id = ?',
      [end_date, id]
    );

    // 2. Retrieve vehicle_id to set status back to 'Available'
    const [logs] = await db.execute('SELECT vehicle_id FROM maintenance_logs WHERE id = ?', [id]);
    if (logs.length > 0) {
      await db.execute('UPDATE vehicles SET status = "Available" WHERE id = ?', [logs[0].vehicle_id]);
    }

    res.json({ success: true, message: 'Maintenance closed and vehicle set to available' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};