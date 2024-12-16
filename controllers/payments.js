const Razorpay = require('razorpay'); // Correct Razorpay import
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const fs = require('fs'); // For file operations (read/write)
const path = require('path');

// Initialize Razorpay instance with key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY, // Store credentials securely in environment variables
  key_secret: process.env.RAZORPAY_SECRET,
});

// Helper functions for reading and writing data
const ordersFilePath = path.join(__dirname, 'orders.json'); // Path to the file for storing orders

function readData() {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, JSON.stringify([])); // Create file if not exists
    }
    const data = fs.readFileSync(ordersFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
}

function writeData(orders) {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error writing orders file:', error);
  }
}

// Create an order
module.exports.createOrders = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options); // Razorpay order creation
    console.log('Order created:', order);

    // Read current orders, add new order, and write back to the file
    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });
    writeData(orders);

    res.json(order); // Send order details to frontend, including order ID
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send('Error creating order');
  }
};

// Verify payment
module.exports.verifyPayments = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const secret = process.env.RAZORPAY_SECRET;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    // Validate signature
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (isValidSignature) {
      // Update the order with payment details
      const orders = readData();
      const order = orders.find((o) => o.order_id === razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        writeData(orders);
      }

      res.status(200).json({ status: 'ok' });
      console.log('Payment verification successful');
    } else {
      res.status(400).json({ status: 'verification_failed' });
      console.log('Payment verification failed');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: 'Error verifying payment' });
  }
};

// Render success page
module.exports.renderSuccessPage = (req, res) => {
  req.flash('success', 'Your payment was successful! Please explore more places.');
  res.redirect('/listings');
};
