const express = require("express");
const Item = require("../models/Item");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const router = express.Router();

/* ===========================
   MULTER CONFIG
=========================== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Images only"));
};

const upload = multer({ storage, fileFilter });

/* ===========================
   DASHBOARD
=========================== */
router.get("/dashboard", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    // Sabhi items ko populate ke saath laao
    const allItems = await Item.find().populate("ownerId", "username");

    // URL se matchIds array mein badlo
    const matchIdsArr = req.query.matchIds ? req.query.matchIds.split(',') : [];

    res.render("dashboard", {
      user: req.session.user,
      items: allItems, // Yahan 'allItems' use karein
      matchIds: matchIdsArr, 
      searchQuery: req.query.q || "",
      message: req.query.message,
      error: req.query.err
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Dashboard error");
  }
});
/* ===========================
   ADD ITEM
=========================== */
router.post("/add", upload.single("image"), async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    const {
      title,
      description,
      type,
      contact,
      location,
      secretVerificationDetail
    } = req.body;

    if (!title || !type || !contact || !location || !secretVerificationDetail) {
      return res.status(400).send("Missing fields");
    }

    const item = new Item({
      title,
      description,
      type,
      contact,
      location,
      secretVerificationDetail,
      ownerId: req.session.user._id,
      image: req.file ? req.file.filename : null,
      status: "available",
      isContactVisible: false
    });

    await item.save();
    
    // Check for smart matches
    const matches = await findSmartMatches(item);
    
if (matches.length > 0) {
    // Matches ki IDs ko comma se join karke URL mein bhej rahe hain
  
    const matchIds = matches.map(m => m._id.toString()).join(',');
   return res.redirect(`/dashboard?message=Smart Match found ${matches.length} items!&matchIds=${matchIds}`);
}
    res.redirect("/dashboard?message=Item added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Add item failed");
  }
});

/* ===========================
   FILTER ROUTES
=========================== */
/* ===========================
   FILTER ROUTES (FIXED)
=========================== */
router.get("/items/all", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const items = await Item.find().populate("ownerId", "username");
    const matchIdsArr = req.query.matchIds ? req.query.matchIds.split(',') : [];
    res.render("dashboard", { user: req.session.user, items, matchIds: matchIdsArr, searchQuery: "" });
  } catch (err) { res.status(500).send("Error"); }
});

router.get("/items/lost", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const items = await Item.find({ type: "lost" }).populate("ownerId", "username");
    const matchIdsArr = req.query.matchIds ? req.query.matchIds.split(',') : [];
    res.render("dashboard", { user: req.session.user, items, matchIds: matchIdsArr, searchQuery: "" });
  } catch (err) { res.status(500).send("Error"); }
});

router.get("/items/found", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const items = await Item.find({ type: "found" }).populate("ownerId", "username");
    const matchIdsArr = req.query.matchIds ? req.query.matchIds.split(',') : [];
    res.render("dashboard", { user: req.session.user, items, matchIds: matchIdsArr, searchQuery: "" });
  } catch (err) { res.status(500).send("Error"); }
});

router.get("/items/my", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const items = await Item.find({ ownerId: req.session.user._id }).populate("ownerId", "username");
    const matchIdsArr = req.query.matchIds ? req.query.matchIds.split(',') : [];
    res.render("dashboard", { user: req.session.user, items, matchIds: matchIdsArr, searchQuery: "" });
  } catch (err) { res.status(500).send("Error"); }
});
/* ===========================
   SEARCH
=========================== */
router.get("/search", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const q = req.query.q;
  if (!q) return res.redirect("/dashboard");

  const items = await Item.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ]
  }).populate("ownerId", "username");
const matchIdsArr = req.query.matchIds ? req.query.matchIds.split(',') : [];
  res.render("dashboard", {
    user: req.session.user,
    items,
    matchIds: matchIdsArr,
    searchQuery: q
  });
});

/* ===========================
   CLAIM ITEM
=========================== */
router.post("/items/:itemId/claim", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { itemId } = req.params;
  const { proofDescription } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send("Invalid item ID");
  }

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).send("Item not found");

    if (item.status === "unclaimed") {
  return res.status(400).send("Item is no longer claimable");
}


    if (item.ownerId.toString() === req.session.user._id.toString()) {
      return res.status(400).send("Cannot claim your own item");
    }

    const alreadyClaimed = item.claims.some(
      c => c.requesterId.toString() === req.session.user._id.toString()
    );

    if (alreadyClaimed) {
      return res.status(400).send("Already claimed");
    }

    item.claims.push({
      requesterId: req.session.user._id,
      proofDescription,
      status: "pending"
    });

    item.status = "pending_claim";
    await item.save();

    res.redirect("/dashboard?message=Claim submitted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Claim error");
  }
});

/* ===========================
   VERIFY CLAIM (POST — FIXED)
=========================== */
router.post("/items/:itemId/claims/:claimId/verify", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const { itemId, claimId } = req.params;
  const { action } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).send("Item not found");

    if (item.ownerId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }

    const claim = item.claims.id(claimId);
    if (!claim) return res.status(404).send("Claim not found");

    if (action === "accept") {
      claim.status = "accepted";
      item.status = "claimed";
      item.isContactVisible = true;

      item.claims.forEach(c => {
        if (c._id.toString() !== claimId && c.status === "pending") {
          c.status = "rejected";
        }
      });
    }

    if (action === "reject") {
      claim.status = "rejected";
      const pending = item.claims.some(c => c.status === "pending");
      if (!pending) {
        item.status = "available";
        item.isContactVisible = false;
      }
    }

    await item.save();
    res.redirect("/dashboard?message=Claim updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
});

/* ===========================
   RESOLVE ITEM
=========================== */
router.post("/items/resolve/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).send("Item not found");

  if (item.ownerId.toString() !== req.session.user._id.toString()) {
    return res.status(403).send("Not allowed");
  }

  item.status = "recovered";
  await item.save();

  res.redirect("/dashboard?message=Item resolved");
});

/* ===========================
   DELETE ITEM (WITH IMAGE CLEANUP)
=========================== */
router.post("/items/delete/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send("Item not found");

    if (item.ownerId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Not allowed");
    }

    // --- NEW: Delete physical file if it exists ---
    if (item.image) {
      const imagePath = path.join(__dirname, "../uploads/", item.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image file:", err);
      });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard?message=Item and image deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
});/* ===========================
   DELETE ITEM (WITH IMAGE CLEANUP)
=========================== */
router.post("/items/delete/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send("Item not found");

    if (item.ownerId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Not allowed");
    }

    // --- NEW: Delete physical file if it exists ---
    if (item.image) {
      const imagePath = path.join(__dirname, "../uploads/", item.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image file:", err);
      });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard?message=Item and image deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
});
//smart match feature 

// Helper function to find matches based on keywords in Title or Location
async function findSmartMatches(item) {
    const searchType = item.type === "lost" ? "found" : "lost";
    
    // Keywords ko clean karke array banana
    const keywords = item.title.split(/\s+/).filter(word => word.length > 2);

    // Agar koi keyword nahi hai toh title use karein, warna regex join karein
    const queryRegex = keywords.length > 0 ? keywords.join("|") : item.title;

    return await mongoose.model("Item").find({
        _id: { $ne: item._id }, 
        type: searchType,
        status: "available",
        $or: [
            { title: { $regex: queryRegex, $options: "i" } },
            { description: { $regex: queryRegex, $options: "i" } },
            { location: { $regex: item.location, $options: "i" } }
        ]
    }).limit(5);
}

module.exports = router;
