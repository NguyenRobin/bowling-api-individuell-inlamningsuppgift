const { request } = require('express');
const Booking = require('../models/bookingModel');
const {
  createBookingNumber,
  countTotalPrice,
  showTimeBooked,
} = require('../utils/utils');

async function requestBooking(request, response) {
  try {
    const { date, time, hours, email, totalPlayers, bowlingAlleyID, shoeSize } =
      request.body;
    const totalPrice = countTotalPrice(totalPlayers, bowlingAlleyID.length);
    const timeToPlay = showTimeBooked(time, hours);
    const bookingID = createBookingNumber();

    const findExistingBooking = await Booking.findOne({
      date,
      time,
      bowlingAlleyID: { $in: bowlingAlleyID },
    });

    if (!findExistingBooking) {
      const newBooking = await Booking.create({
        date,
        time,
        hours,
        bookedHours: timeToPlay,
        totalPlayers,
        email,
        bowlingAlleyID,
        shoeSize,
        totalPrice,
        bookingID,
      });

      const result = {
        date,
        timeToPlay,
        email,
        totalPlayers,
        bowlingAlleyID,
        shoeSize,
        totalPrice,
        bookingID,
      };
      response.status(201).json({ status: true, result });
    } else {
      response
        .status(400)
        .json({ status: false, message: 'WHATA FUCK IS THIS DATE' });
    }
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
}

// async function updateBooking(request, response) {
//   try {
//     const { id } = request.params;
//     const { date, time, bowlingAlleyID } = request.body;
//     const myBooking = await Booking.findById({ _id: id });
//     console.log('we found myBooking ', myBooking);
//     console.log(date, time, bowlingAlleyID);
//     // const findExistingBooking = await Booking.findOne({
//     // date,
//     // time,
//     // bowlingAlleyID: { $in: bowlingAlleyID },
//     // });
//     // console.log(findExistingBooking, 'horungefungera');
//     const requestUpdate = await Booking.findOne({
//       _id: { $ne: myBooking.id },
// $or: [
//   {
//     $and: [
//       { date },
//       { time },
//       { bowlingAlleyID: { $in: bowlingAlleyID } },
//     ],
//   },
//   // { $and: [{}] },
// ],
//     });

//     console.log(requestUpdate, 'requestUpdate');
//     if (!requestUpdate) {
//       const totalPrice = countTotalPrice(
//         myBooking.totalPlayers,
//         myBooking.bowlingAlleyID.length
//       );
//       const updateBooking = await Booking.findOneAndUpdate(
//         { _id: id },
//         myBooking,
//         requestUpdate,
//         totalPrice,
//         { new: true, runValidators: true }
//       );
//       response.status(201).json({ status: true, updateBooking });
//     }
//   } catch (error) {
//     response.status(400).json({ status: 400, message: error.message });
//   }
// }

async function deleteBooking(request, response) {
  try {
    const deleteDoc = await Booking.findOneAndDelete({
      bookingID: request.params.id,
    });
    if (deleteDoc) {
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
    console.log(findExistingBooking, 'findExistingBooking');

    if (!findExistingBooking) {
      const totalPrice = countTotalPrice(
        update.totalPlayers,
        update.bowlingAlleyID.length
      );
      const bookedHours = showTimeBooked(update.time, update.hours);
      update.totalPrice = totalPrice;
      update.bookedHours = bookedHours;
      const updateDoc = await Booking.findByIdAndUpdate(update.id, update, {
        new: true,
        runValidators: true,
      });
      // console.log(updateDoc, 'updateDoc');
      await updateDoc.save();
      return response.status(200).json({ status: true, result: updateDoc });
    } else {
      throw new Error('The requested booking is not valid');
    }
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
  }
}

async function searchDate(request, response) {
  try {
    console.log(request.query);
  } catch (error) {}
}
// async function updateBooking(request, response) {
//   try {
//     const id = request.params.id;
//     const doc = await Booking.findOne({ _id: id });

//     // Manuellt tilldela egenskaperna från request.body till doc
//     doc.date = request.body.date;
//     doc.time = request.body.time;
//     doc.bowlingAlleyID = request.body.bowlingAlleyID;
//     doc.totalPlayers = request.body.totalPlayers;
//     doc.shoeSize = request.body.shoeSize;

//     const findExistingBooking = await Booking.findOne({
//       date: doc.date,
//       time: doc.time,
//       bowlingAlleyID: { $in: doc.bowlingAlleyID },
//       totalPlayers: doc.totalPlayers,
//       shoeSize: doc.shoeSize,
//     });

//     if (!findExistingBooking) {
//       const updateDoc = await doc.save();

//       return response.status(200).json({ status: true, result: updateDoc });
//     } else {
//       throw new Error('The requested booking is not valid');
//     }
//   } catch (error) {
//     response.status(400).json({ status: 400, message: error.message });
//   }
// }

module.exports = { requestBooking, updateBooking, deleteBooking, searchDate };
