const express = require('express');
const app = express();
const seedDB = require('./seed');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const session = require('express-session');
const flash = require('connect-flash');


mongoose.connect('mongodb://localhost:27017/shop-db')
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));

// seedDB();

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'ThisIsASecret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.send('Home');
});

app.use(productRoutes);

app.listen(3000, (req, res) => {
    console.log("Server runnign at 3000");
});