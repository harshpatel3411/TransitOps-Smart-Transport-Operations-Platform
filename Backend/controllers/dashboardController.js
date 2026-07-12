const db = require('../config/db');

exports.getKpis = async (req, res) => {
  try {
    // 1. Get total counts
    const [vehicles] = await db.execute('SELECT COUNT(*) as count FROM vehicles');
    const [trips] = await db.execute('SELECT COUNT(*) as count FROM trips WHERE status = "Dispatched"');
    const [drivers] = await db.execute('SELECT COUNT(*) as count FROM drivers WHERE status = "Available"');
    const [maintenance] = await db.execute('SELECT COUNT(*) as count FROM maintenance_logs WHERE status = "Active"');

    // 2. Aggregate results
    const data = {
      totalVehicles: vehicles[0].count,
      activeTrips: trips[0].count,
      availableDrivers: drivers[0].count,
      vehiclesInShop: maintenance[0].count
    };

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};