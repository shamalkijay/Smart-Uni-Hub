const db = require("../config/db");

exports.getUserDetails = (req, res) => {
  const { userId } = req.params;

  // Fetch updated user stats including fine_balance
  const sql = `
    SELECT id, name, email, role, fine_balance
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch user details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = results[0];

    // Fetch user fines history
    const finesSql = `SELECT * FROM fines WHERE user_id = ?`;
    
    db.query(finesSql, [userId], (fineErr, fineResults) => {
      // We gracefully handle if fines table is missing or errors out
      userProfile.fines = fineErr ? [] : fineResults;
      res.json(userProfile);
    });
  });
};
