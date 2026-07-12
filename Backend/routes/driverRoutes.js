const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, driverController.getAllDrivers);
router.post('/', protect, driverController.createDriver);
router.put('/:id', protect, driverController.updateDriver);
router.get('/available', protect, driverController.getAvailableDrivers);

module.exports = router;