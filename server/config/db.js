const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/skillbridge');
        console.log('MongoDB Connected');
    } catch (error) {
        console.log('MongoDB Connection Error');
    }
};

module.exports = connectDB;
