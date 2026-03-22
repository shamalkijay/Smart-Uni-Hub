const express = require("express");
const router = express.Router();
const { getUnpaidFines, markFineAsPaid } = require("../controllers/fineController");

router.get("/unpaid", getUnpaidFines);
router.put("/pay/:fineId", markFineAsPaid);

module.exports = router;
