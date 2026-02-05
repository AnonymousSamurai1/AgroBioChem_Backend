const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
   try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
   
   console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
   } 
   catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red.bold)
   }
};
 module.exports=connectDB