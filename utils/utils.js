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
  return `confirmation-${uuidv4()}`;
}

function countTotalPrice(totalPlayers, totalFields) {
  const pricePerPerson = 120;
  const pricePerField = 100;
  const total = totalPlayers * pricePerPerson + pricePerField * totalFields;
  return `${total} SEK`;
}

function showFieldTimeBooked(requestTime) {
  const output = `${requestTime} - ${(+requestTime + 1).toString()}.00`;
  console.log(output);
  return output;
}

module.exports = { createBookingNumber, countTotalPrice, showFieldTimeBooked };
