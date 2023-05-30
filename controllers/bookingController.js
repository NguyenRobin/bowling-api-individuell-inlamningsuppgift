const Booking = require('../models/bookingModel');
const {
  createBookingNumber,
  countTotalPrice,
  showFieldTimeBooked,
} = require('../utils/utils');

async function requestBooking(request, response) {
  console.log(+Math.round(request.body.requestTime));
  try {
    const {
      requestDate,
      requestTime,
      email,
      totalPlayers,
      fieldIdToBook,
      shoeSize,
    } = request.body;
    const totalPrice = countTotalPrice(totalPlayers, fieldIdToBook.length);
    const timeToPlay = showFieldTimeBooked(requestTime);
    const bookingID = createBookingNumber();

    const findBooking = await Booking.findOne({
      requestDate,
      requestTime,
      fieldIdToBook: { $in: fieldIdToBook },
    });
    console.log(findBooking);
    if (!findBooking) {
      const bookingRequest = await Booking.create({
        requestDate,
        requestTime,
        totalPlayers,
        email,
        fieldIdToBook,
        shoeSize,
        totalPrice,
        bookingID,
      });

      const result = {
        date: requestDate,
        timeToPlay,
        email,
        totalPlayers,
        fields: fieldIdToBook,
        shoeSize,
        totalPrice,
        bookingID,
      };
      response.status(201).json({ status: true, result });
    } else {
      response.status(200).json({
        status: true,
        message: 'Please try another Date, time or field',
      });
    }
  } catch (error) {
    response.status(400).json({ status: 400, message: error });
  }
}

module.exports = { requestBooking };