const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/fuel-efficiency', protect, reportController.getFuelEfficiency);
router.get('/utilization', protect, reportController.getUtilization);
router.get('/cost', protect, reportController.getCost);
router.get('/roi', protect, reportController.getRoi);
router.get('/export', protect, reportController.exportReport);

module.exports = router;