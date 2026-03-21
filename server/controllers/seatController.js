const db = require("../config/db");

exports.getAllSeats = (req, res) => {
  const { date, startTime, endTime } = req.query;

  const sql = `
    SELECT 
      s.id,
      s.table_id,
      s.seat_number,
      CASE
        WHEN b.id IS NOT NULL THEN 'booked'
        ELSE 'available'
      END AS status
    FROM seats s
    LEFT JOIN bookings b
      ON s.id = b.seat_id
      AND b.booking_date = ?
      AND b.status = 'booked'
      AND (
        (b.start_time < ? AND b.end_time > ?) OR
        (b.start_time >= ? AND b.start_time < ?)
      )
    ORDER BY s.table_id, s.seat_number
  `;

  db.query(sql, [date, endTime, startTime, startTime, endTime], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching seats" });
    }

    res.json(result);
  });
};
