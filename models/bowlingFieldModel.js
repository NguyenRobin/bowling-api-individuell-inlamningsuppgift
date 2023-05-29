const mongoose = require('mongoose');

const bowlingBookingSchema = new mongoose.Schema({
  field_id: {
    type: Number,
    required: [true, 'Field must have a id'],
    min: [1, 'Please choice between field 1-8'],
    max: [8, 'Please choice between field 1-8'],
  },
  requestDate: { type: Date, required: [true, 'Please choice a date'] },
  requestTime: {
    type: String,
    required: [true, 'Please enter what time you want to start playing. '],
  },
  email: { type: String, required: [true, 'Must have a valid email'] },
  totalPlayers: { type: Number, required: [true, 'Enter total players'] },
  shoeSize: {
    type: [Number],
    required: [true, 'Please enter each players shoe size'],
    minLength: totalPlayers,
  },
});
