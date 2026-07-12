const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/fuel-efficiency', protect, reportController.getFuelEfficiency);
router.get('/utilization', protect, reportController.getUtilization);

module.exports = router;