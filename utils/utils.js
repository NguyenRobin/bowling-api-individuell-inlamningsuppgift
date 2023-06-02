const { v4: uuidv4 } = require('uuid');

function createBookingNumber() {
  return uuidv4();
}

function countTotalPrice(totalPlayers, totalFields) {
  const pricePerPerson = 120;
  const pricePerField = 100;
  const total = totalPlayers * pricePerPerson + pricePerField * totalFields;
  return `${total} SEK`;
}

function showBookedHours(requestTime, hours = 1) {
  const start = Math.round(parseInt(requestTime));
  const end = start + hours;
  let output;
  if (start < 10 && end < 10) {
    output = `0${start}:00 - 0${end}:00`;
  }
  if (start < 10 && end >= 10) {
    output = `0${start}:00 - ${end}:00`;
  }
  if (start > 10 && end > 10) {
    output = `${start}:00 - ${end}:00`;
  }
  return output;
}

function timeFormatting(requestTime) {
  const time = Math.round(parseInt(requestTime));
  let output;
  if (time < 10) {
    output = `0${time}:00`;
  } else {
    output = `${time}:00`;
  }
  return output;
}

module.exports = {
  createBookingNumber,
  countTotalPrice,
  showBookedHours,
  timeFormatting,
};
