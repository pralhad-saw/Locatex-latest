/*
===========================================================
 Project: LocateX – Smart Lost and Found Solution
 Author: Pralhad Saw
 Copyright (c) 2026 Pralhad Saw

 Unauthorized copying, modification, or distribution is prohibited.
===========================================================
*/

require('dotenv').config();

const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const Item = require("../models/Item");
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const nodemailer = require("nodemailer");



function protect(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

router.get("/profile", protect, (req, res) => {
  res.render("profile", { user: req.session.user });
});

router.get("/contact", protect, (req, res) => {
  res.render("contact");
});

// router.post("/contact", protect, (req, res) => {
//   console.log("Message from user:", req.body);
//   res.send("Message sent ✔️");
// });

router.get("/about", protect, (req, res) => {
  res.render("about");
});

// router.get("/status", protect, (req, res) => {
//   res.render("status", { item: null });
// });

router.get("/feedback", protect, (req, res) => {
  res.render("feedback");
});

// router.post("/feedback", protect, (req, res) => {
//   console.log("User feedback:", req.body);
//   res.send("Thanks for your feedback ✔️");
// });


router.get("/profile/edit", protect, (req, res) => {
  res.render("editProfile", { user: req.session.user });
});

router.post("/profile/edit", protect, async (req, res) => {
  const { username, email } = req.body;

  await User.findByIdAndUpdate(req.session.user._id, { 
    username, 
    email 
  });

  req.session.user.username = username;
  req.session.user.email = email;

  res.redirect("/profile");
});



router.post("/contact", protect, async (req, res) => {
  const { name, email, message } = req.body;

  try {
  await transporter.sendMail({
  from: `"${name}" <${process.env.EMAIL_USER}>`, // Gmail account
  replyTo: email, // user email for replies
  to: process.env.EMAIL_USER, // admin receives
  subject: "New Contact Message From Lost & Found System",
  html: `
    <h3>New message from: ${name}</h3>
    <p><b>Email:</b> ${email}</p>
    <p><b>Message:</b><br>${message}</p>
  `
})

    // res.send("Your message has been sent to admin successfully ✔️");
    res.redirect("/contact?success=Your message has been sent to admin successfully."); 

  } catch (error) {
    console.error(error);
    // res.send("Error sending message ❌");
    res.redirect("/contact?error=Error sending message.");
  }
});



router.get("/status", protect, async (req, res) => {
  try {
    // Find all items where this user has submitted a claim
    const myClaims = await Item.find({
      "claims.requesterId": req.session.user._id
    }).populate("ownerId", "username");

    res.render("status", { myClaims, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading status page");
  }
});


router.post("/feedback", protect, async (req, res) => {
   try {
    const newFeedback = new Feedback({
      message: req.body.message,
      userId: req.session.user._id
    });

    await newFeedback.save();  // THIS IS IMPORTANT

    // res.send("Feedback submitted successfully ✔️");
    res.redirect("/feedback?success=Feedback submitted successfully.");
  } catch (err) {
    console.error("Feedback error:", err);
    // res.status(500).send("Error submitting feedback ❌");
    res.redirect("/feedback?error=Error submitting feedback.");
  }
});

//to send gmail message in contact
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = router;
