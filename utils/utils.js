const { v4: uuidv4 } = require('uuid');

function generateDate() {
  const date = new Date().toLocaleDateString('se-sv');
  return date;
}

function generateTime() {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  const seconds = date.getSeconds();
  const time = `${hour}:${min}:${seconds}`;
  return time;
}

function createBookingNumber() {
  return uuidv4();
}

function countTotalPrice(totalPlayers, totalFields) {
  const pricePerPerson = 120;
  const pricePerField = 100;
  const total = totalPlayers * pricePerPerson + pricePerField * totalFields;
  return `${total} SEK`;
}

function showTimeBooked(requestTime, hours = 1) {
  const start = Math.round(parseInt(requestTime));
  console.log('utils', start);
  const end = start + hours;
  console.log(requestTime, 'showFieldTimeBooked');
  let output;
  if (start < 10) {
    return (output = `${start}:00 - ${end}:00`);
  } else {
    return (output = `${start}:00 - ${end}:00`);
  }
}

module.exports = { createBookingNumber, countTotalPrice, showTimeBooked };
