const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const app = express();
const connectDB = require('./db');
const cors = require('cors');

// DataBase Connection
connectDB();

// ENV connection
dotenv.config({ path: './.env' });

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlesware
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const Admins = require('./routes/adminRoute');
const Keys = require('./routes/keyRoute');
const Products = require('./routes/productRoute');
const Questions = require('./routes/questionRoute');

app.use('/agrobiochem/api/admins', Admins);
app.use('/agrobiochem/api/keys', Keys);
app.use('/agrobiochem/api/products', Products);
app.use('/agrobiochem/api/questions', Questions);

const PORT = process.env.PORT;
const DEV = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(`server running in ${DEV} mode on port ${PORT}`.yellow.bold);
});
