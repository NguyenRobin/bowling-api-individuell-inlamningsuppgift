const mongoose = require('mongoose');

// SCHEMA
const bookingSchema = new mongoose.Schema({
  requestDate: {
    type: Date,
    required: [true, 'Please choice a date YYYY-MM-DD'],
  },
  requestTime: {
    type: String,
    maxLength: 5,
    required: [
      true,
      'Please choice what time you want to start playing. HH:MM ',
    ],
  },
  email: { type: String, required: [true, 'Must have a valid email'] },
  totalPlayers: {
    type: Number,
    min: [1, 'Enter total players'],
    validate: {
      validator: function (totalPlayers) {
        return totalPlayers === this.get('shoeSize').length;
      },
      message: `Amount of players and amount of shoes don't match`,
    },
  },
  fieldIdToBook: {
    type: [
      {
        type: Number,
        min: 1,
        max: 8,
      },
    ],
    validate: {
      validator: function (fieldIdToBook) {
        return fieldIdToBook.length > 0 && fieldIdToBook.length <= 8;
      },
      message: `minimum 1 field must be requested and maximum 8 fields`,
    },
  },
  shoeSize: {
    type: [Number],
    required: [true, 'Please enter each players shoe size'],
    validate: {
      validator: function (shoeSize) {
        return shoeSize.length === this.get('totalPlayers');
      },
      message: `Amount of players and amount of shoes don't match`,
    },
  },
  totalPrice: {
    type: String,
    required: true,
  },
  bookingID: { type: String, required: true },
});

// MODEL
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
