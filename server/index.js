const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
const userRoute = require('./routes/userRoute');
const stockRoute = require('./routes/stockRoute');
const transactionRoute = require('./routes/transactionRoute');
const orderRoute = require('./routes/orderRoute');
const marketRoutes = require('./routes/marketRoute');

app.use('/api/users', userRoute);
app.use('/api/stocks', stockRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/orders', orderRoute);
app.use('/api/market', marketRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('Trading App API is running...');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});