const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Render login page
router.get("/login", (req, res) => {
    if (req.session.user) return res.redirect("/dashboard");
    res.render("login");
});

// Render register page
router.get("/register", (req, res) => {
    if (req.session.user) return res.redirect("/dashboard");
    res.render("register");
});
// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        // req.session.user = user;
        // res.redirect("/dashboard"); // after successful register
        res.render("login",{successMessage: "Registration Successful! Please Login. "});
    } catch (err) {
        console.error(err);
        // res.send("Error during registration ");
            res.render("register",{errorMessage: "Error during registration."});
    }
});

// Login
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { errorMessage: "No user found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { errorMessage: "Invalid password" });
    }

    // Store plain object – avoids Mongoose doc issues
    req.session.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role || "user"
    };

    console.log("Session set for:", req.session.user.username, "role:", req.session.user.role);

    if (req.session.user.role === "admin") {
      return res.redirect("/admin");
    }
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.render("login", { errorMessage: "Server error during login" });
  }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

router.get("/", (req, res) => {
    res.render("index");
}
);
module.exports = router;
