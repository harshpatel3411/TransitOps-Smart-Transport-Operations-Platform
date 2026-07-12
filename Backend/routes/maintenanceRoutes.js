const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, maintenanceController.getMaintenance);
router.post('/', protect, maintenanceController.addMaintenance);
router.put('/:id/close', protect, maintenanceController.closeMaintenance);

module.exports = router;