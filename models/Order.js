const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, unique: true, required: true }, // e.g., KK-1234
    pickupStore: { type: String, required: true },
    storeAddress: { type: String },
    items: [{ type: String, required: true }],
    deliveryAddress: { type: String, required: true },
    additionalNotes: { type: String },
    preferredTime: { type: String, required: true },
       paymentMethod: { type: String, enum: ['easypaisa', 'jazzcash'], required: true },
    paymentSS: { type: String }, // Yahan screenshot ka path save hoga
    isPaid: { type: Boolean, default: false },
  
    paidAt: { type: Date }, // Naya
    deliveryFee: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Request Received', 'Order Accepted', 'Rider Assigned', 'Picking Up', 'On the Way', 'Delivered', 'Cancelled'],
        default: 'Request Received'
    },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);