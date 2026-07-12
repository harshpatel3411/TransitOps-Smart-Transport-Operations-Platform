const db = require('../config/db');

exports.getKpis = async (req, res) => {
  try {
    const [vehicles] = await db.execute('SELECT COUNT(*) as count FROM vehicles');
    const [dispatchedTrips] = await db.execute('SELECT COUNT(*) as count FROM trips WHERE status = "Dispatched"');
    const [pendingTrips] = await db.execute('SELECT COUNT(*) as count FROM trips WHERE status = "Draft"');
    const [availableDrivers] = await db.execute('SELECT COUNT(*) as count FROM drivers WHERE status = "Available"');
    const [driversOnDuty] = await db.execute('SELECT COUNT(*) as count FROM drivers WHERE status != "Available"');
    const [maintenance] = await db.execute('SELECT COUNT(*) as count FROM maintenance_logs WHERE status = "Active"');

    const totalVehicles = Number(vehicles[0].count || 0);
    const activeTrips = Number(dispatchedTrips[0].count || 0);
    const availableDriverCount = Number(availableDrivers[0].count || 0);
    const vehiclesInShop = Number(maintenance[0].count || 0);

    const data = {
      totalVehicles,
      activeTrips,
      availableDrivers: availableDriverCount,
      vehiclesInShop,
      availableVehicles: totalVehicles,
      pendingTrips: Number(pendingTrips[0].count || 0),
      driversOnDuty: Number(driversOnDuty[0].count || 0),
      inMaintenance: vehiclesInShop,
      utilization: totalVehicles > 0 ? Math.round((activeTrips / totalVehicles) * 100) : 0,
    };

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};