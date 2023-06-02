const Booking = require('../models/bookingModel');
const {
  createBookingNumber,
  countTotalPrice,
  showBookedHours,
  timeFormatting,
} = require('../utils/utils');

async function requestBooking(request, response) {
  try {
    const { date, time, hours, email, totalPlayers, bowlingAlleyID, shoeSize } =
      request.body;
    const totalPrice = countTotalPrice(totalPlayers, bowlingAlleyID?.length);
    const timeToPlay = showBookedHours(time, hours);
    const timeFormat = timeFormatting(time);
    const bookingID = createBookingNumber();

    const findExistingBooking = await Booking.findOne({
      date,
      time,
      bowlingAlleyID: { $in: bowlingAlleyID },
    });

    if (!findExistingBooking) {
      const newBooking = await Booking.create({
        date,
        time: timeFormat,
        hours,
        bookedHours: timeToPlay,
        totalPlayers,
        email,
        bowlingAlleyID,
        shoeSize,
        totalPrice,
        bookingID,
      });
      response
        .status(201)
        .json({ status: true, message: 'New booking created' });
    } else {
      response.status(404).json({
        status: true,
        message: 'Please try another date, time or alley',
      });
    }
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
}

async function deleteBooking(request, response) {
  try {
    const booking = await Booking.findOneAndDelete({
      bookingID: request.params.id,
    });
    if (booking) {
      response.status(204).json({ status: true });
    } else {
      response
        .status(404)
        .json({ status: false, message: 'booking not found' });
    }
  } catch (error) {
    response.status(400).json({ status: false, message: error.message });
  }
}

async function updateBooking(request, response) {
  try {
    const id = request.params.id;
    const update = await Booking.findOne({ _id: id });

    for (const key in request.body) {
      if (request.body.hasOwnProperty(key)) {
        update[key] = request.body[key];
      }
    }

    const findExistingBooking = await Booking.findOne({
      _id: { $ne: update.id },
      date: update.date,
      time: update.time,
      bowlingAlleyID: { $in: update.bowlingAlleyID },
    });

    if (!findExistingBooking) {
      const totalPrice = countTotalPrice(
        update.totalPlayers,
        update.bowlingAlleyID.length
      );
      const bookedHours = showBookedHours(update.time, update.hours);
      // const timeToPlay = showBookedHours(update.time, update.hours);

      update.totalPrice = totalPrice;
      update.bookedHours = bookedHours;
      // update.timeToPlay = timeToPlay;

      const updateBooking = await Booking.findByIdAndUpdate(update.id, update, {
        new: true,
        runValidators: true,
      });
      await updateBooking.save();
      return response.status(200).json({ status: true, result: updateBooking });
    } else {
      throw new Error('The requested booking is not valid');
    }
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
}

async function myBooking(request, response) {
  try {
    const { id } = request.params;
    const booking = await Booking.findById(id);
    if (booking) {
      const result = {
        date: booking.date.toLocaleDateString('se-sv'),
        time: booking.time,
        bookedHours: booking.bookedHours,
        totalPlayers: booking.totalPlayers,
        bowlingAlleyID: booking.bowlingAlleyID,
        totalPrice: booking.totalPrice,
      };
      response.status(200).json({ status: true, result });
    } else {
      throw new Error('Your booking could not be found');
    }
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
}

async function searchDate(request, response) {
  try {
    const { start, end } = request.query;
    const startingDate = new Date(start);
    const endingDate = new Date(end);

    const dateInterval = await Booking.find({
      date: { $gte: startingDate, $lte: endingDate },
    }).sort({ date: 'asc' });

    if (dateInterval) {
      const dates = dateInterval.map((value) => {
        const result = {
          date: value.date.toLocaleDateString('se-sv'),
          from: value.bookedHours,
          bookedAlleys: value.bowlingAlleyID,
        };
        return result;
      });

      response.status(200).json({
        status: true,
        result: dates.length,
        bookings: dates.length > 0 ? dates : 'No bookings found',
      });
    }
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
}

module.exports = {
  requestBooking,
  updateBooking,
  deleteBooking,
  searchDate,
  myBooking,
};
