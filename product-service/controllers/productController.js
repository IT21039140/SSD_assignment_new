const Product = require("../models/productModels");
const mongoose = require("mongoose");

// Middleware to validate CSRF token
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

// Get all products
const getProducts = async (req, res) => {
    const products = await Product.find({}).sort({ createdAT: -1 });
    res.status(200).json(products);
};

// Get a single product
const getOneProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Product" });
    }

    const oneProduct = await Product.findById(id);

    if (!oneProduct) {
        return res.status(400).json({ error: "No such Product" });
    }

    res.status(200).json(oneProduct);
};

// Add new product
const addProduct = async (req, res) => {
    const { image, tital, price, quantity, description } = req.body;

    // Validate CSRF token for the request
    if (!req.csrfToken) {
        return res.status(403).json({ error: "CSRF token is missing or invalid." });
    }

    try {
        const product = await Product.create({
            image,
            tital,
            price,
            quantity,
            description,
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Product" });
    }

    const product = await Product.findOneAndDelete({ _id: id });

    if (!product) {
        return res.status(400).json({ error: "No such Product" });
    }

    res.status(200).json(product);
};

// Update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Product" });
    }
    const product = await Product.findByIdAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );
    if (!product) {
        return res.status(400).json({ error: "No such Product" });
    }
    res.status(200).json(product);
};

module.exports = {
    getProducts,
    getOneProduct,
    deleteProduct,
    updateProduct,
    addProduct,
};
