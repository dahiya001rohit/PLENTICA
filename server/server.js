require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDb = require('./connectDb');
const getRoute = require('./routes/getRoutes');

// Connect to MongoDB
// connectDb(process.env.MONGO_URI)
//     .then(() => {
//         console.log('Database connection established');
//     })
//     .catch((error) => {
//         console.error('Database connection error:', error);
//     });

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sample route
app.use('/', getRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});