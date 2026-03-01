const mongoose = require('mongoose')

const connectDb = async (URL) => {
    try {
        await mongoose.connect(URL);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with an error code
    }
}

module.exports = connectDb;