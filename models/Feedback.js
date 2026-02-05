/*
===========================================================
 Project: LocateX – Smart Lost and Found Solution
 Author: Pralhad Saw
 Copyright (c) 2026 Pralhad Saw

 Unauthorized copying, modification, or distribution is prohibited.
===========================================================
*/

const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  message: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
