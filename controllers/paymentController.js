const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',
                        product_data: {
                            name: 'Knock Knock Delivery Advance',
                            description: '50% Advance payment for your order',
                        },
                        // Stripe amount hamesha "paisa" mein leta hai.
                        // 50000 paisa = Rs. 500
                        unit_amount: 50000, 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5000/api/orders/payment/success',
            cancel_url: 'http://localhost:5000/api/orders/payment/cancel',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("STRIPE ERROR:", error);
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
};

const Order = require('../models/Order');

exports.paymentSuccess = async (req, res) => {
    try {
        // URL se session_id nikalna (Stripe bhejta hai)
        const sessionId = req.query.session_id;
        
        if (sessionId) {
            // Yahan hum real webhook ka kaam kar rahe hain (Testing ke liye)
            // Hum latest order ko dhoond kar isPaid true kar denge
            const latestOrder = await Order.findOne().sort({ createdAt: -1 });
            if (latestOrder && !latestOrder.isPaid) {
                latestOrder.isPaid = true;
                latestOrder.status = 'Order Accepted'; // Status update kar diya!
                latestOrder.paidAt = Date.now();
                await latestOrder.save();
            }
        }
        
        res.send('<h1>Payment Successful!</h1><p>Your advance has been received. Your order is now confirmed and accepted.</p><br><a href="http://127.0.0.1:5500/index.html">Go back to website</a>');
    } catch (error) {
        res.send('<h1>Payment Successful!</h1><p>Your advance has been received.</p>');
    }
};

exports.paymentCancel = (req, res) => {
    res.send('<h1>Payment Cancelled</h1><p>Your order was not placed.</p><br><a href="http://127.0.0.1:5500/index.html">Try again</a>');
};