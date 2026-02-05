/*
===========================================================
 Project: LocateX – Smart Lost and Found Solution
 Author: Pralhad Saw
 Copyright (c) 2026 Pralhad Saw

 Unauthorized copying, modification, or distribution is prohibited.
===========================================================
*/

const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  userId: String
});

module.exports = mongoose.model("Contact", ContactSchema);
