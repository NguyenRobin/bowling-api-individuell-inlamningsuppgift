const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/booking', bookingController.requestBooking);
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);
router.get('/', bookingController.searchDate);
router.get('/booking/:id', bookingController.myBooking);

module.exports = router;
