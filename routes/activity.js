// routes/activity.js
const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");

// POST /api/activity → log a new activity
router.post("/", async (req, res) => {
  try {
    const { user, action } = req.body;

    if (!user || !action) {
      return res.status(400).json({ error: "User and action are required" });
    }

    const newActivity = new Activity({ user, action });
    await newActivity.save();

    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// GET /api/activity → fetch all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }); // newest first
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
