const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  userId: String
});

module.exports = mongoose.model("Contact", ContactSchema);
