const Order = require('../models/OrdersModel');
const mongoose = require('mongoose');

// Middleware for input validation and sanitization
const validateOrderInput = (data) => {
    const errors = {};
    // Check for required fields in the order input
    if (!data.userId) {
        errors.userId = 'userId is a required field.';
    }
    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
        errors.products = 'products must be a non-empty array.';
    }
    return Object.keys(errors).length > 0 ? { error: errors } : null;
};

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }); // Ensure the field is correctly spelled
        res.status(200).json(orders);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single order
const getOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    try {
        const order = await Order.findById(id).select('-__v'); // Exclude version key for security
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create an order
const createOrder = async (req, res) => {
    // Validate input
    const validationError = validateOrderInput(req.body);
    if (validationError) {
        return res.status(400).json(validationError);
    }

    // Destructure and sanitize inputs
    const { userId, products, subtotal, total, shipping, order_status, payment_status } = req.body;

    // Construct the order data safely
    const orderData = {
        userId: mongoose.Types.ObjectId(userId), // Sanitize userId to ObjectId
        products: products.map(product => ({
            productId: mongoose.Types.ObjectId(product.productId), // Assuming each product has an ID
            quantity: product.quantity, // Ensure quantity is properly validated elsewhere
            // You can add more sanitization/validation here for each product
        })),
        subtotal: parseFloat(subtotal), // Convert to number and ensure it's a valid value
        total: parseFloat(total), // Convert to number and ensure it's a valid value
        shipping: shipping ? shipping : undefined, // Optional field, use if provided
        order_status: order_status, // Ensure this is validated if it's critical
        payment_status: payment_status, // Ensure this is validated if it's critical
    };

    try {
        const order = await Order.create(orderData); // Use sanitized and validated order data
        res.status(201).json(order); // Use 201 for created resource
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Delete order
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    try {
        const order = await Order.findOneAndDelete({ _id: id });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update order
const updateOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    try {
        const updateData = {};
        // Only add fields to update if they are present in the request body
        if (req.body.userId) updateData.userId = mongoose.Types.ObjectId(req.body.userId);
        if (req.body.products) updateData.products = req.body.products;
        if (req.body.subtotal) updateData.subtotal = parseFloat(req.body.subtotal);
        if (req.body.total) updateData.total = parseFloat(req.body.total);
        if (req.body.shipping) updateData.shipping = req.body.shipping;
        if (req.body.order_status) updateData.order_status = req.body.order_status;
        if (req.body.payment_status) updateData.payment_status = req.body.payment_status;

        const order = await Order.findOneAndUpdate({ _id: id }, updateData, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createOrder,
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
};
