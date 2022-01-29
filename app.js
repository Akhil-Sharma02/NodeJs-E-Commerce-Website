const express = require("express");
const app = express();
const seedDB = require("./seed");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
require("dotenv").config();

mongoose
    .connect("mongodb://localhost:27017/shop-db")
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));

// seedDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
    session({
        secret: "ThisIsASecret",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);

app.listen(3000, (req, res) => {
    console.log("Server runnign at port 3000");
});
