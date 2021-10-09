const express = require('express');
const router = express.Router();
const Product = require('../models/product');


router.get("/products", async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
});

router.get("/products/new", (req, res) => {
    res.render('products/new');
});

router.post("/products", async (req, res) => {
    const product = {
        ...req.body
    };
    await Product.create(product);
    res.redirect("/products");
});

router.get("/products/:id", async(req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/show', {product});
});

router.get("/products/:id/edit", async(req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });
});

router.patch("/products/:id", async(req, res) => {
    const updatedProduct = req.body;
    const {id} = req.params;
    await Product.findByIdAndUpdate(id, updatedProduct);
    res.redirect("/products");
});

router.delete("/products/:id", async (req, res) => {
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
});


module.exports = router;