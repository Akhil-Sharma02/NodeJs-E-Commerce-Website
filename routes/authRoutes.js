const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Get signup page
router.get("/register", (req, res) => {
    res.render("auth/signup");
});

// Regiter new user
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({
            username: username,
            email: email,
        });
        await User.register(user, password);
        req.flash("success", "Signed Up Successfully!");
        res.redirect("/products");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

// Login page
router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        const { username } = req.user;
        req.flash("success", `Welcome ${username}`);
        res.redirect("/products");
    }
);

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out Successfully!!!");
    res.redirect("/login");
});

module.exports = router;
