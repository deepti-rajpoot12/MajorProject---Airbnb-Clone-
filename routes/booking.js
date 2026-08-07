const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, bookingController.index);

router.get("/:id/new", isLoggedIn, bookingController.renderBookingForm);

router.post("/:id/create-order", isLoggedIn, bookingController.createPaymentOrder);

router.post("/:id/verify-payment", isLoggedIn, bookingController.verifyPayment);
router.post("/:id/payment-failed", isLoggedIn, bookingController.markPaymentFailed);

module.exports = router;
