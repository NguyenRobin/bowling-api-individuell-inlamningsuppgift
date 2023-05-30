const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/booking', bookingController.requestBooking);

module.exports = router;
