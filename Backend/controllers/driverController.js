const db = require('../config/db');

exports.getAllDrivers = async (req, res) => {
  const [drivers] = await db.execute('SELECT * FROM drivers');
  res.json({ success: true, data: drivers });
};

exports.createDriver = async (req, res) => {
  const { name, license_number, license_category, license_expiry_date, contact_number, status, safety_score } = req.body;
  try {
    if (!name || !license_number || !license_expiry_date) {
      return res.status(400).json({ success: false, message: 'Name, license number, and expiry date are required.' });
    }

    const [result] = await db.execute(
      'INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, status, safety_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, license_number, license_category || '', license_expiry_date, contact_number || '', status || 'Available', safety_score ?? 0]
    );

    const [rows] = await db.execute('SELECT * FROM drivers WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    const message = err?.message || 'Unable to create driver';
    res.status(500).json({ success: false, message });
  }
};

exports.updateDriver = async (req, res) => {
  const { id } = req.params;
  const { status, safety_score } = req.body;
  await db.execute('UPDATE drivers SET status = ?, safety_score = ? WHERE id = ?', [status, safety_score, id]);
  res.json({ success: true, message: 'Driver updated' });
};

exports.getAvailableDrivers = async (req, res) => {
  const [drivers] = await db.execute("SELECT * FROM drivers WHERE status = 'Available'");
  res.json({ success: true, data: drivers });
};