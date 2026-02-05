/*
===========================================================
 Project: LocateX – Smart Lost and Found Solution
 Author: Pralhad Saw
 Copyright (c) 2026 Pralhad Saw

 Unauthorized copying, modification, or distribution is prohibited.
===========================================================
*/

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
require("./jobs/unclaimedItems");


// ===== View Engine & Static Files =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== IMPORTANT: Session FIRST (only ONE instance) =====
app.use(
  session({
    secret: "lostfoundsecret-2026-change-this-to-long-random-string",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      httpOnly: true,
      secure: false,                   // ← change to true only when using HTTPS
      sameSite: "lax"
    }
  })
);
// ===== Body Parser =====
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());  // if you ever need JSON bodies

// ===== Global flash messages =====
app.use((req, res, next) => {
  res.locals.successMessage = req.query.success || null;
  res.locals.errorMessage   = req.query.error   || null;
  next();
});

// ===== MongoDB =====
mongoose
  .connect("mongodb://127.0.0.1:27017/locatex")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// ===== Routes =====
const adminRoutes = require("./routes/admin");
const authRoutes  = require("./routes/auth");
const itemRoutes  = require("./routes/items");
const pagesRoutes = require("./routes/pages");

app.use("/", authRoutes);
app.use("/", itemRoutes);
app.use("/", pagesRoutes);
app.use("/", adminRoutes);      // admin last – its paths are more specific

// ===== Homepage =====
app.get("/", (req, res) => {
  res.render("index");
});

// ===== Start =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);