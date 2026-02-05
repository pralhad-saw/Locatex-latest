const express = require("express");
const User = require("../models/User");
const Item = require("../models/Item");
const Feedback = require("../models/Feedback");
const mongoose = require("mongoose");
const generateItemCSV = require("../utils/csv");

const router = express.Router();

/* =========================
   ADMIN AUTH MIDDLEWARE
========================= */
function adminProtect(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("<h1>403 Forbidden: Admin Access Required</h1>");
  }
  next();
}

/* =========================
   ADMIN DASHBOARD
========================= */
router.get("/admin", adminProtect, async (req, res) => {
  try {
    const users = await User.find();
    const items = await Item.find().populate("ownerId", "username");
    const feedbacks = await Feedback.find().populate("userId", "username");

    res.render("admin", {
      user: req.session.user, // 🔥 VERY IMPORTANT
      users,
      items,
      feedbacks
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).send("Error loading admin dashboard");
  }
});

/* =========================
   DOWNLOAD USERS CSV
========================= */
router.get("/download/users", adminProtect, async (req, res) => {
   try {
    const users = await User.find().select("username email createdAt");

    // CSV header
    let csv = "Username,Email,Created At\n";

    // CSV rows
    users.forEach(user => {
        csv += `"${user.username}","${user.email}","${user.createdAt}"\n`;
        
    });

    // Set headers to force download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users_report.csv");

    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating report");
  }

});

/* =========================
   DOWNLOAD ITEMS CSV
========================= */
router.get('/user/download-csv', adminProtect, async (req, res) => {
  try {
  const items = await Item.find()
    .populate("ownerId", "username email")
    .select(
      "title description type contact status isContactVisible location createdAt ownerId"
    );

  // CSV header
  let csv =
    "Title,Description,Type,Contact,Status,Contact Visible,Location,Owner Username,Owner Email,Created At\n";

  // CSV rows
  items.forEach(item => {
    csv += `"${item.title || ""}",` +
           `"${item.description || ""}",` +
           `"${item.type}",` +
           `"${item.contact || ""}",` +
           `"${item.status}",` +
           `"${item.isContactVisible}",` +
           `"${item.location}",` +
           `"${item.ownerId?.username || ""}",` +
           `"${item.ownerId?.email || ""}",` +
           `"${item.createdAt}"\n`;
  });

  // Force download
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=items_report.csv"
  );

  res.send(csv);

} catch (err) {
  console.error(err);
  res.status(500).send("Error generating items report");
}

});


/* =========================
   DELETE ITEM
========================= */
router.post("/admin/delete/item/:id", adminProtect, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid item ID");
  }

  try {
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).send("Item not found");

    res.redirect("/admin");
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).send("Error deleting item");
  }
});

/* =========================
   DELETE USER
========================= */
router.post("/admin/delete/user/:id", adminProtect, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    // ❌ prevent admin deleting himself
    if (id === req.session.user._id.toString()) {
      return res.status(400).send("You cannot delete your own account");
    }

    await Item.deleteMany({ ownerId: id });
    await User.findByIdAndDelete(id);

    res.redirect("/admin");
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).send("Error deleting user");
  }
});

/* =========================
   DELETE FEEDBACK
========================= */
router.post("/admin/delete/feedback/:id", adminProtect, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).send("Error deleting feedback");
  }
});

module.exports = router;
