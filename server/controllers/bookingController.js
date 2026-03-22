const db = require("../config/db");

exports.createBooking = (req, res) => {
  const { user_id, seat_id, date, start_time, end_time } = req.body;

  // 0. Check for unpaid fines first
  const fineCheckSql = `SELECT id FROM fines WHERE user_id = ? AND status = 'unpaid' LIMIT 1`;
  db.query(fineCheckSql, [user_id], (fineErr, fineResults) => {
    if (fineErr) {
      console.error("Fine check error:", fineErr);
    }

    if (fineResults && fineResults.length > 0) {
      return res.status(403).json({
        message: "You have unpaid fines. Please settle your fine balance before making a new booking."
      });
    }

    // 1. Check if user already has an active booking
  const activeBookingSql = `
    SELECT * FROM bookings
    WHERE user_id = ?
    AND status IN ('booked', 'occupied')
    LIMIT 1
  `;

  db.query(activeBookingSql, [user_id], (activeErr, activeResults) => {
    if (activeErr) {
      console.error(activeErr);
      return res.status(500).json({ message: "Error checking user active booking" });
    }

    if (activeResults.length > 0) {
      return res.status(400).json({
        message: "You already have an active booking. Complete or cancel it before making a new booking."
      });
    }

    // 2. Check seat conflict
    const conflictSql = `
      SELECT * FROM bookings
      WHERE seat_id = ?
      AND booking_date = ?
      AND status IN ('booked', 'occupied')
      AND (
        (start_time < ? AND end_time > ?) OR
        (start_time >= ? AND start_time < ?)
      )
    `;

    const conflictParams = [seat_id, date, end_time, start_time, start_time, end_time];

    db.query(conflictSql, conflictParams, (conflictErr, conflictResults) => {
      if (conflictErr) {
        console.error(conflictErr);
        return res.status(500).json({ message: "Error checking booking conflicts" });
      }

      if (conflictResults.length > 0) {
        return res.status(409).json({
          message: "This seat is already booked for the selected time."
        });
      }

      // 3. Insert booking
      const insertSql = `
        INSERT INTO bookings (user_id, seat_id, booking_date, start_time, end_time, status)
        VALUES (?, ?, ?, ?, ?, 'booked')
      `;

      db.query(insertSql, [user_id, seat_id, date, start_time, end_time], (insertErr) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ message: "Booking failed" });
        }

        res.json({ message: "Seat booked successfully" });
      });
    });
  });
  });
};

exports.completeBooking = (req, res) => {
  const { bookingId } = req.params;

  const sql = `
    UPDATE bookings
    SET status = 'completed'
    WHERE id = ?
  `;

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to complete booking" });
    }

    res.json({ message: "Booking marked as completed" });
  });
};

exports.cancelBooking = (req, res) => {
  const { bookingId } = req.params;

  const sql = `
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = ?
  `;

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to cancel booking" });
    }

    res.json({ message: "Booking cancelled successfully" });
  });
};

exports.getActiveBookingByUser = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT b.*, s.table_id, s.seat_number
    FROM bookings b
    JOIN seats s ON b.seat_id = s.id
    WHERE b.user_id = ?
    AND b.status IN ('booked', 'occupied')
    ORDER BY b.created_at DESC
    LIMIT 1
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch active booking" });
    }

    if (results.length === 0) {
      return res.json(null);
    }

    res.json(results[0]);
  });
};

// student clicks "I Arrived"
exports.markArrivalByStudent = (req, res) => {
  const { bookingId } = req.params;

  const checkSql = `
    SELECT * FROM arrival_confirmations
    WHERE booking_id = ?
    LIMIT 1
  `;

  db.query(checkSql, [bookingId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error(checkErr);
      return res.status(500).json({ message: "Error checking arrival record" });
    }

    if (checkResults.length > 0) {
      const updateSql = `
        UPDATE arrival_confirmations
        SET student_confirmed = TRUE,
            student_confirmed_at = NOW(),
            status = 'pending'
        WHERE booking_id = ?
      `;

      db.query(updateSql, [bookingId], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ message: "Failed to mark arrival" });
        }

        return res.json({ message: "Arrival marked successfully. Waiting for admin confirmation." });
      });
    } else {
      const insertSql = `
        INSERT INTO arrival_confirmations
        (booking_id, student_confirmed, student_confirmed_at, status)
        VALUES (?, TRUE, NOW(), 'pending')
      `;

      db.query(insertSql, [bookingId], (insertErr) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ message: "Failed to mark arrival" });
        }

        return res.json({ message: "Arrival marked successfully. Waiting for admin confirmation." });
      });
    }
  });
};

// admin gets pending arrival confirmations
exports.getPendingArrivals = (req, res) => {
  const sql = `
    SELECT 
      ac.id AS arrival_id,
      ac.booking_id,
      ac.student_confirmed,
      ac.student_confirmed_at,
      ac.status AS arrival_status,
      b.status AS booking_status,
      b.user_id,
      b.booking_date,
      b.start_time,
      b.end_time,
      s.table_id,
      s.seat_number,
      u.name AS student_name,
      u.email AS student_email
    FROM arrival_confirmations ac
    JOIN bookings b ON ac.booking_id = b.id
    JOIN seats s ON b.seat_id = s.id
    JOIN users u ON b.user_id = u.id
    WHERE ac.status = 'pending'
    ORDER BY ac.student_confirmed_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch pending arrivals" });
    }

    res.json(results);
  });
};

// admin confirms student is present
exports.confirmArrivalByAdmin = (req, res) => {
  const { bookingId } = req.params;
  const { admin_id } = req.body;

  const updateArrivalSql = `
    UPDATE arrival_confirmations
    SET admin_confirmed = TRUE,
        admin_confirmed_at = NOW(),
        admin_id = ?,
        status = 'confirmed'
    WHERE booking_id = ?
  `;

  db.query(updateArrivalSql, [admin_id, bookingId], (arrivalErr) => {
    if (arrivalErr) {
      console.error(arrivalErr);
      return res.status(500).json({ message: "Failed to confirm arrival" });
    }

    const updateBookingSql = `
      UPDATE bookings
      SET status = 'occupied'
      WHERE id = ?
    `;

    db.query(updateBookingSql, [bookingId], (bookingErr) => {
      if (bookingErr) {
        console.error(bookingErr);
        return res.status(500).json({ message: "Failed to update booking status" });
      }

      res.json({ message: "Arrival confirmed successfully" });
    });
  });
};

// admin marks no show + create fine
exports.markNoShowByAdmin = (req, res) => {
  const { bookingId } = req.params;
  const { admin_id, fine_amount } = req.body;

  const getBookingSql = `
    SELECT * FROM bookings
    WHERE id = ?
    LIMIT 1
  `;

  db.query(getBookingSql, [bookingId], (getErr, bookingResults) => {
    if (getErr) {
      console.error(getErr);
      return res.status(500).json({ message: "Failed to fetch booking" });
    }

    if (bookingResults.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingResults[0];

    const updateArrivalSql = `
      UPDATE arrival_confirmations
      SET admin_confirmed = FALSE,
          admin_confirmed_at = NOW(),
          admin_id = ?,
          status = 'no_show'
      WHERE booking_id = ?
    `;

    db.query(updateArrivalSql, [admin_id, bookingId], (arrivalErr) => {
      if (arrivalErr) {
        console.error(arrivalErr);
        return res.status(500).json({ message: "Failed to mark no show" });
      }

      const updateBookingSql = `
        UPDATE bookings
        SET status = 'no_show'
        WHERE id = ?
      `;

      db.query(updateBookingSql, [bookingId], (bookingErr) => {
        if (bookingErr) {
          console.error(bookingErr);
          return res.status(500).json({ message: "Failed to update booking status" });
        }

        const insertFineSql = `
          INSERT INTO fines (user_id, booking_id, amount, reason, status)
          VALUES (?, ?, ?, 'Student was not present at booked study seat', 'unpaid')
        `;

        db.query(insertFineSql, [booking.user_id, bookingId, fine_amount], (fineErr) => {
          if (fineErr) {
            console.error(fineErr);
            return res.status(500).json({ message: "Failed to create fine" });
          }

          // ONLY run if users table has fine_balance
          const checkUserRowSql = `SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'fine_balance' AND TABLE_SCHEMA = 'Smart_Uni_Hub_db'`;
          db.query(checkUserRowSql, (schemaErr, cols) => {
            if(cols && cols.length > 0) {
              const updateUserFineSql = `
                UPDATE users
                SET fine_balance = fine_balance + ?
                WHERE id = ?
              `;
              db.query(updateUserFineSql, [fine_amount, booking.user_id], (userErr) => {
                res.json({ message: "Student marked as no-show and fine added successfully" });
              });
            } else {
              res.json({ message: "Student marked as no-show and fine added successfully to fines table" });
            }
          });

        });
      });
    });
  });
};
