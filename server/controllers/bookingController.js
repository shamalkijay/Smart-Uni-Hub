const db = require("../config/db");

exports.createBooking = (req, res) => {
  const { user_id, seat_id, date, start_time, end_time } = req.body;

  // 1. Check for conflicts
  const conflictSql = `
    SELECT * FROM bookings
    WHERE seat_id = ?
    AND booking_date = ?
    AND (
      (start_time < ? AND end_time > ?) OR
      (start_time >= ? AND start_time < ?)
    )
  `;
  const conflictParams = [seat_id, date, end_time, start_time, start_time, end_time];

  db.query(conflictSql, conflictParams, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error checking for booking conflicts" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Booking conflict: The seat is already booked for the selected time." });
    }

    // 2. If no conflict, create booking
    const insertSql = `
      INSERT INTO bookings (user_id, seat_id, booking_date, start_time, end_time, status)
      VALUES (?, ?, ?, ?, ?, 'booked')
    `;
    const insertParams = [user_id, seat_id, date, start_time, end_time];

    db.query(insertSql, insertParams, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Booking failed" });
      }

      res.json({ message: "Seat booked successfully" });
    });
  });
};
