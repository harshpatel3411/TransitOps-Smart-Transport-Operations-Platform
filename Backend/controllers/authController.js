const db = require('../config/db'); // Ensure this path matches your structure
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('Registering user with:', { name, email, role ,password});
  try {
    const [roles] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
    console.log('roles:', roles);
    if (roles.length === 0) return res.status(400).json({ message: 'Invalid role' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, roles[0].id]
    );

    res.status(201).json({ success: true, data: { id: result.insertId, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute('SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE email = ?', [email]);
    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: users[0].id, role: users[0].role_name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, data: { token, user: { id: users[0].id, name: users[0].name, role: users[0].role_name } } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, data: req.user });
};