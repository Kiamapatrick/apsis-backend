// models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: String, required: true },   // e.g., user email
  action: { type: String, required: true }, // description of the activity
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);
