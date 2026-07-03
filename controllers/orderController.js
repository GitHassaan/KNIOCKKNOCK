const Order = require('../models/Order');
const User = require('../models/User');
const Setting = require('../models/Setting');
const multer = require('multer');

// Glitch par files disk par save nahi hoti, isliye memory storage use karenge
const storage = multer.memoryStorage();
exports.upload = multer({ storage: storage });

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { pickupStore, items, deliveryAddress, preferredTime, paymentMethod } = req.body;
        
        const orderId = `KK-${Math.floor(1000 + Math.random() * 9000)}`;

        // Image ko base64 string mein convert kar ke database mein save karna
        let paymentSS = null;
        if (req.file) {
            paymentSS = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        const order = await Order.create({
            user: req.user._id,
            orderId,
            pickupStore,
            items: JSON.parse(items),
            deliveryAddress,
            preferredTime,
            paymentMethod,
            paymentSS,
            status: 'Request Received'
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("ORDER CREATE ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Track Order by ID
exports.trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id })
                                 .populate('user', 'name phone')
                                 .populate('rider', 'name phone');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get logged in user's orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
                                 .populate('user', 'name phone')
                                 .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            if (req.body.riderId) order.rider = req.body.riderId;
            
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// PUBLIC: Get settings (for prices)
exports.getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = await Setting.create({});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Update settings
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = await Setting.create(req.body);
        else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
