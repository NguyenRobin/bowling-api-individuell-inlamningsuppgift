const mongoose = require('mongoose');

// SCHEMA
const bookingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please choice a date YYYY-MM-DD'],
  },
  time: {
    type: String,
    required: [
      true,
      'Please choice what time you want to start playing. HH:MM ',
    ],
  },
  hours: { type: Number, default: 1 },
  bookedHours: { type: String },
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
  bowlingAlleyID: {
    type: [
      {
        type: Number,
        min: 1,
        max: 8,
      },
    ],
    required: true,
    validate: {
      validator: function (bowlingAlleyID) {
        return bowlingAlleyID.length >= 1 && bowlingAlleyID.length <= 8;
      },
      message: `Choice which bowling alley you would like to book. Each unique id from 1-8`,
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

bookingSchema.pre('validate', function (next) {
  if (parseInt(this.time) + this.hours > 23) {
    return next(new Error('bowling is closing at 23.00'));
  } else {
    next();
  }
});

bookingSchema.pre('save', function (next) {
  // if the user input minutes in the request. (only whole hours should go through)
  const minutes = +this.time.split(':')[1];
  if (minutes > 0) {
    next(
      new Error(
        'Only whole hours can be booked. Please make sure to not enter minutes greater than 0'
      )
    );
  } else {
    next();
  }
});

bookingSchema.pre('save', function (next) {
  const openingHours = { open: 7, close: 23 };
  const requestTime = parseInt(this.time);
  if (requestTime < openingHours.open || requestTime >= openingHours.close) {
    return next(new Error(`Bowling is closed. Open hours: 07.00 - 23.00`));
  } else {
    next();
  }
});

bookingSchema.pre('save', function (next) {
  const isFormatValid = this.time.match(
    /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  );
  if (isFormatValid) {
    next();
  } else {
    next(
      new Error('Enter a time to start (HH:MM) in whole Hours, example 7:00 ')
    );
  }
});
bookingSchema.pre('validate', function (next) {
  if (this.bowlingAlleyID.length !== new Set(this.bowlingAlleyID).size) {
    return next(
      new Error(`You're not allowed to enter the same alley id twice`)
    );
  } else {
    next();
  }
});

// MODEL
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
