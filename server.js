const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middleware (Images ki size barhai hai taake crash na ho)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Base route
app.get('/', (req, res) => {
    res.send('Knock Knock API is running...');
});

// Vercel ke liye app export karna lazmi hai
module.exports = app;
