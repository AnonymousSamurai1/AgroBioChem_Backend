const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./db');

dotenv.config(); 

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/agrobiochem/api/admins', require('./routes/adminRoute'));
app.use('/agrobiochem/api/keys', require('./routes/keyRoute'));
app.use('/agrobiochem/api/products', require('./routes/productRoute'));
app.use('/agrobiochem/api/questions', require('./routes/questionRoute'));


module.exports = app;