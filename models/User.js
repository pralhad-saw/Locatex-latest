const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, default: "user" ,
          enum: ["user", "admin"]} // "user" or "admin"
});

module.exports = mongoose.model("User", userSchema);