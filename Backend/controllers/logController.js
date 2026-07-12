const db = require('../config/db');

// --- Fuel Logs ---
exports.getFuelLogs = async (req, res) => {
  try {
    const [logs] = await db.execute('SELECT * FROM fuel_logs');
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addFuelLog = async (req, res) => {
  const { vehicle_id, trip_id, liters, cost, log_date } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date) VALUES (?, ?, ?, ?, ?)',
      [vehicle_id, trip_id, liters, cost, log_date]
    );
    res.status(201).json({ success: true, logId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Expenses ---
exports.getExpenses = async (req, res) => {
  try {
    const [expenses] = await db.execute('SELECT * FROM expenses');
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addExpense = async (req, res) => {
  const { vehicle_id, type, amount, expense_date, description } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO expenses (vehicle_id, type, amount, expense_date, description) VALUES (?, ?, ?, ?, ?)',
      [vehicle_id, type, amount, expense_date, description]
    );
    res.status(201).json({ success: true, expenseId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};