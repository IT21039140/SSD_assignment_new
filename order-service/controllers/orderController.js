const Order = require('../models/OrdersModel');
const mongoose = require('mongoose');

// Middleware for input validation
const validateOrderInput = (data) => {
    // Check for required fields in the order input
    if (!data.userId || !data.products) {
        return { error: 'userId and products are required fields.' };
    }
    return null;
};

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createAt: -1 });
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
        const order = await Order.findById(id);
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

    const { userId, products, subtotal, total, shipping, order_status, payment_status } = req.body;
    try {
        const order = await Order.create({ userId, products, subtotal, total, shipping, order_status, payment_status });
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
        const order = await Order.findOneAndUpdate({ _id: id }, req.body, { new: true });
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
    createOrder, // Fixed function name
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
};
