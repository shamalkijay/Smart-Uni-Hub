const express = require("express");
const router = express.Router();

const {
  createBooking,
  completeBooking,
  cancelBooking,
  getActiveBookingByUser,
  markArrivalByStudent,
  getPendingArrivals,
  confirmArrivalByAdmin,
  markNoShowByAdmin
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.put("/complete/:bookingId", completeBooking);
router.put("/cancel/:bookingId", cancelBooking);
router.get("/active/:userId", getActiveBookingByUser);

// arrived confirmation flow
router.put("/arrive/:bookingId", markArrivalByStudent);
router.get("/pending-arrivals", getPendingArrivals);
router.put("/admin-confirm/:bookingId", confirmArrivalByAdmin);
router.put("/admin-no-show/:bookingId", markNoShowByAdmin);

module.exports = router;
