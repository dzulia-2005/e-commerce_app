const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoose connected successfully");
    } catch (error) {
        console.error("database is not connected",error);
    }
}

module.exports = connectDB