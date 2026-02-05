const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  message: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
