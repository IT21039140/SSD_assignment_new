const Order = require('../models/OrdersModel');
const mongoose = require('mongoose');

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error); // Safe logging
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
    console.error('Error fetching order:', error); // Safe logging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create an order
const createOrder = async (req, res) => {
  const { userId, products, subtotal, total, shipping, order_status, payment_status } = req.body;

  // Validate required fields
  if (!userId || !Array.isArray(products) || products.length === 0 || !subtotal || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sanitizedUserId = mongoose.Types.ObjectId(userId);
    const sanitizedProducts = products.map((product) => ({
      productId: mongoose.Types.ObjectId(product.productId),
      quantity: parseInt(product.quantity, 10),
    }));

    const orderData = {
      userId: sanitizedUserId,
      products: sanitizedProducts,
      subtotal: parseFloat(subtotal),
      total: parseFloat(total),
      shipping: shipping || undefined,
      order_status: order_status || undefined,
      payment_status: payment_status || undefined,
    };

    const order = await Order.create(orderData);
    res.status(201).json(order); // 201 for resource creation
  } catch (error) {
    console.error('Error creating order:', error); // Safe logging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an order
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
    console.error('Error deleting order:', error); // Safe logging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  // Whitelist fields that can be updated
  const { products, subtotal, total, shipping, order_status, payment_status } = req.body;
  const updateData = {};

  if (products && Array.isArray(products)) {
    updateData.products = products.map((product) => ({
      productId: mongoose.Types.ObjectId(product.productId),
      quantity: parseInt(product.quantity, 10),
    }));
  }
  if (subtotal !== undefined) updateData.subtotal = parseFloat(subtotal);
  if (total !== undefined) updateData.total = parseFloat(total);
  if (shipping !== undefined) updateData.shipping = shipping;
  if (order_status !== undefined) updateData.order_status = order_status;
  if (payment_status !== undefined) updateData.payment_status = payment_status;

  try {
    const order = await Order.findOneAndUpdate({ _id: id }, updateData, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error); // Safe logging
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
