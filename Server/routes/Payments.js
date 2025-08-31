// Import the required modules
// const express = require("express")
// const router = express.Router()

// const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
// const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
// router.post("/capturePayment", auth, isStudent, capturePayment)
// router.post("/verifyPayment",auth, isStudent, verifyPayment)
// router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

// module.exports = router

const express = require('express');
const { createStripePaymentSession } = require('../controllers/Payments');
const { auth, isStudent } = require('../middlewares/auth');

const router = express.Router();

router.post('/createStripePaymentSession', auth, isStudent, createStripePaymentSession);

module.exports = router;