const db = require('../config/db');

exports.getAllDrivers = async (req, res) => {
  const [drivers] = await db.execute('SELECT * FROM drivers');
  res.json({ success: true, data: drivers });
};

exports.createDriver = async (req, res) => {
  const { name, license_number, license_category, license_expiry_date, contact_number } = req.body;
  const [result] = await db.execute(
    'INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number) VALUES (?, ?, ?, ?, ?)',
    [name, license_number, license_category, license_expiry_date, contact_number]
  );
  res.status(201).json({ success: true, data: { id: result.insertId } });
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