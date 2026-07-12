const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, tripController.createTrip);
router.put('/:id/dispatch', protect, tripController.dispatchTrip);
router.put('/:id/complete', protect, tripController.completeTrip);
router.put('/:id/cancel', protect, tripController.cancelTrip);

module.exports = router;