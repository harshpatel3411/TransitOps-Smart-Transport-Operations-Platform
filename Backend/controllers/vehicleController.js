const db = require('../config/db');

// GET /vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const [vehicles] = await db.execute('SELECT * FROM vehicles');
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /vehicles
exports.createVehicle = async (req, res) => {
  const { registration_number, name_model, type, max_load_capacity, acquisition_cost, region } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO vehicles (registration_number, name_model, type, max_load_capacity, acquisition_cost, region) VALUES (?, ?, ?, ?, ?, ?)',
      [registration_number, name_model, type, max_load_capacity, acquisition_cost, region]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /vehicles/:id
exports.updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { status, odometer, region } = req.body;
  try {
    await db.execute(
      'UPDATE vehicles SET status = ?, odometer = ?, region = ? WHERE id = ?',
      [status, odometer, region, id]
    );
    res.json({ success: true, message: 'Vehicle updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /vehicles/available
exports.getAvailableVehicles = async (req, res) => {
  try {
    const [vehicles] = await db.execute("SELECT * FROM vehicles WHERE status = 'Available'");
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};