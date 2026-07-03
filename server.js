const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
    // Yeh Stripe webhook hai (Local testing ke liye)
    // Jab website live hogi, toh Stripe dashboard mein is URL ko add karenge
    res.status(200).send('Webhook Received');
});
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
module.exports = app;

// Base route
app.get('/', (req, res) => {
    res.send('Knock Knock API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
