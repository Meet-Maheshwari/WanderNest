const express = require("express");
const paymentControllers = require("../controllers/payments.js");
const { isLoggedIn } = require("../middleware.js");
const router = express.Router();


// Route to handle order creation
router.post('/create-order', paymentControllers.createOrders);
  
// Route to serve the success page
router.get('/payment-success', paymentControllers.renderSuccessPage);
  
// Route to handle payment verification
router.post('/verify-payment', paymentControllers.verifyPayments);

module.exports = router;