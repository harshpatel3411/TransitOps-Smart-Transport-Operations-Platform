const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, vehicleController.getAllVehicles);
router.post('/', protect, vehicleController.createVehicle);
router.put('/:id', protect, vehicleController.updateVehicle);
router.get('/available', protect, vehicleController.getAvailableVehicles);

module.exports = router;