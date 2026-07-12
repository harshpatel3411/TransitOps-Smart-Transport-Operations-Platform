const db = require('../config/db');

// GET /reports/fuel-efficiency
// Formula: Total Distance / Total Fuel Consumed
exports.getFuelEfficiency = async (req, res) => {
  try {
    const query = `
      SELECT v.name_model, 
             SUM(t.actual_distance) / SUM(t.fuel_consumed) as efficiency
      FROM trips t
      JOIN vehicles v ON t.vehicle_id = v.id
      WHERE t.status = 'Completed' AND t.fuel_consumed > 0
      GROUP BY v.id`;
    
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
      SELECT v.name_model, COUNT(t.id) as total_trips
      FROM vehicles v
      LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
      GROUP BY v.id`;
      
    const [results] = await db.execute(query);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};