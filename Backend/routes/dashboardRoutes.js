const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/kpis', protect, dashboardController.getKpis);

module.exports = router;