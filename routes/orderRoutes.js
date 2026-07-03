const express = require('express');
const { createOrder, trackOrder, getMyOrders, getAllOrders, updateOrderStatus, getUsers, getSettings, updateSettings, upload } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Order Routes (upload middleware image handle karega)
router.post('/', protect, upload.single('paymentSS'), createOrder);
router.get('/track/:id', trackOrder);
router.get('/myorders', protect, getMyOrders);

// Admin Routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/users', protect, admin, getUsers);

// Settings Routes
router.get('/settings', getSettings);
router.put('/settings', protect, admin, updateSettings);

module.exports = router;