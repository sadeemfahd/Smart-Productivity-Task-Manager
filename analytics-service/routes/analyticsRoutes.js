const express = require("express");
const {
  getSummary,
  getOverdueTasks,
  getPriorityStats,
  getCompletionRate
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/summary", getSummary);
router.get("/overdue", getOverdueTasks);
router.get("/priority", getPriorityStats);
router.get("/completion-rate", getCompletionRate);

module.exports = router;
