const db = require('../config/db');

// GET /reports/fuel-efficiency
// Formula: Total Distance / Total Fuel Consumed
exports.getFuelEfficiency = async (req, res) => {
  try {
    const query = `
      SELECT COALESCE(v.name_model, CONCAT('Vehicle ', v.id)) as name_model,
             CASE WHEN SUM(t.fuel_consumed) > 0 THEN ROUND(SUM(t.actual_distance) / SUM(t.fuel_consumed), 2) ELSE 0 END as efficiency
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicle_id = v.id
      WHERE t.status = 'Completed' AND COALESCE(t.fuel_consumed, 0) > 0
      GROUP BY v.id, v.name_model`;

    const [results] = await db.execute(query);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /reports/utilization
// Formula: (Trips / Total Available Time) - Here simplified as count of completed trips per vehicle
exports.getUtilization = async (req, res) => {
  try {
    const query = `
      SELECT COALESCE(v.name_model, CONCAT('Vehicle ', v.id)) as name_model, COUNT(t.id) as total_trips
      FROM vehicles v
      LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
      GROUP BY v.id, v.name_model`;

    const [results] = await db.execute(query);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCost = async (req, res) => {
  try {
    const [results] = await db.execute(
      'SELECT COALESCE(SUM(amount), 0) AS total_cost FROM expenses'
    );
    res.json({ success: true, data: results[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRoi = async (req, res) => {
  try {
    const [expenseRows] = await db.execute('SELECT COALESCE(SUM(amount), 0) AS total_cost FROM expenses');
    const [tripRows] = await db.execute('SELECT COUNT(*) AS total_trips FROM trips WHERE status = "Completed"');
    const roi = tripRows[0].total_trips > 0 ? Number((tripRows[0].total_trips / Math.max(expenseRows[0].total_cost, 1)).toFixed(2)) : 0;
    res.json({ success: true, data: { roi } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { report = 'fuel-efficiency' } = req.query;
    const csv = `report,type\n${report},csv`;
    res.type('text/csv').send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};