const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234", // <-- oyage password eka
  database: "Smart_Uni_Hub_db"
});

db.connect((err) => {
  if (err) {
    console.log("DB connection error:", err);
  } else {
    console.log("MySQL connected");
  }
});

module.exports = db;
