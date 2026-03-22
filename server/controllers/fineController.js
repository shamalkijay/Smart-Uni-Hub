const db = require("../config/db");

exports.getUnpaidFines = (req, res) => {
  const sql = `
    SELECT f.id AS fine_id, f.amount, f.reason, u.name AS student_name, u.email AS student_email
    FROM fines f
    JOIN users u ON f.user_id = u.id
    WHERE f.status = 'unpaid'
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching unpaid fines" });
    }
    return res.json(results || []);
  });
};

exports.markFineAsPaid = (req, res) => {
  const { fineId } = req.params;

  db.query(`SELECT user_id, amount FROM fines WHERE id = ?`, [fineId], (getErr, getResults) => {
    if (getErr || getResults.length === 0) return res.status(404).json({ message: "Fine not found" });

    const fine = getResults[0];

    db.query(`UPDATE fines SET status = 'paid' WHERE id = ?`, [fineId], (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Failed to update fine status" });

      const checkUserRowSql = `SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'fine_balance' AND TABLE_SCHEMA = 'Smart_Uni_Hub_db'`;
      db.query(checkUserRowSql, (schemaErr, cols) => {
        if (cols && cols.length > 0) {
          const updateUserFineSql = `
            UPDATE users
            SET fine_balance = GREATEST(0, fine_balance - ?)
            WHERE id = ?
          `;
          db.query(updateUserFineSql, [fine.amount, fine.user_id], () => {
             res.json({ message: "Fine marked as paid successfully." });
          });
        } else {
           res.json({ message: "Fine marked as paid successfully." });
        }
      });
    });
  });
};
