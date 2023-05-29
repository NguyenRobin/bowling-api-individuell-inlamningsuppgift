const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DATABASE_URL;

const app = express();
app.use(express.json());

async function connectMongooseWithMongoDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Mongoose and MongoDb are successfully connected!✅');
  } catch (error) {
    console.log(error);
  }
}
connectMongooseWithMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}..🏃🏻`);
});
