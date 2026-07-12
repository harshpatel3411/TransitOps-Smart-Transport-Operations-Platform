const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

// Fuel Endpoints
router.get('/fuel-logs', protect, logController.getFuelLogs);
router.post('/fuel-logs', protect, logController.addFuelLog);

// Expense Endpoints
router.get('/expenses', protect, logController.getExpenses);
router.post('/expenses', protect, logController.addExpense);

module.exports = router;