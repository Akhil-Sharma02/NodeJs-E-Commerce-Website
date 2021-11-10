const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');

//Products page
router.get("/products", async (req, res) => {
    try{
        const products = await Product.find({});
        res.render('products/index', {products});
    }
    catch(e){
        req.flash('error', 'Oops, Something went Wrong.');
        res.redirect('/error');
    }
});


//Display new product page
router.get("/products/new", (req, res) => {
    res.render('products/new');
});

// Adds product to the database
router.post("/products", async (req, res) => {
    try{
        const product = {
        ...req.body
        };
        await Product.create(product);
        req.flash('success', 'Product Added Successfully!');
        res.redirect("/products");
    }
    catch(e){
        req.flash('error', 'Oops, Something went Wrong.');
        res.redirect('/error');
    }
});

// A particular product page
router.get("/products/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findById(id).populate("reviews");
        res.render('products/show', {product});
    }
    catch(e){
        req.flash('error', 'Oops, Something went Wrong.');
        res.redirect('/error');
    }
});

// Adds a review to a particular product
router.post("/products/:id/review", async(req, res) => {
    // res.send("Added review");
    try{
        const { id } = req.params;
        const product = await Product.findById(id);
        const { rating, comment } = req.body;
        const review = new Review({rating, comment});
        product.reviews.push(review);
        await product.save();
        await review.save();
        req.flash('success', 'Review posted Successfully!');
        res.redirect(`/products/${id}`);
    }
    catch(e){
        req.flash('error', 'Oops, Something went Wrong.');
        res.redirect('/error');
    } 
});

// Page for editing a product
router.get("/products/:id/edit", async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product });
    }
    catch(e){
        req.flash('error', 'Oops, Something went Wrong.');
        res.redirect('/error');
    }
});

// Patch/Add changes to a product
router.patch("/products/:id", async(req, res) => {
    try{
        const updatedProduct = req.body;
        const {id} = req.params;
        await Product.findByIdAndUpdate(id, updatedProduct);
        res.redirect("/products");
    }
    catch(e){
        req.flash('error', 'Oops, Something went Wrong.');
        res.redirect('/error');
    }
});

// Deletes a product
router.delete("/products/:id", async (req, res) => {
    try{
        const {id} = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect("/products");
    }
    catch(e){
        req.flash('error', 'Oops, Something went Wrong.');
        res.redirect('/error');
    }
});

router.get('/error', (req, res) => {
    res.render('../views/error');
})


module.exports = router;