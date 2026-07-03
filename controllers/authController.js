const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token generate karne ka function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ phone }, { email }] });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Role decide karna: Agar phone 03011200143 hai toh admin, warna customer
        const role = phone === '03011200143' ? 'admin' : 'customer';

        // User create karna
        const user = await User.create({ 
            name, 
            phone, 
            email, 
            password,
            role 
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { phone, password } = req.body;
    try {
        // User ko phone ya email se dhoondhna
        const user = await User.findOne({ $or: [{ phone: phone }, { email: phone }] });
        
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid phone or password' });
        }
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};