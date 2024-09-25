const Order = require("../models/OrdersModel");
const mongoose = require("mongoose");

// Middleware for input validation and sanitization
const validateOrderInput = (data) => {
  const errors = {};
  // Check for required fields in the order input
  if (!data.userId) {
    errors.userId = "userId is a required field.";
  }
  if (
    !data.products ||
    !Array.isArray(data.products) ||
    data.products.length === 0
  ) {
    errors.products = "products must be a non-empty array.";
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
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single order
const getOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(id).select("-__v"); // Exclude version key for security
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create an order
const createOrder = async (req, res) => {
  // Validate input
  const validationError = validateOrderInput(req.body);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  // Destructure the request body
  const {
    userId,
    products,
    subtotal,
    total,
    shipping,
    order_status,
    payment_status,
  } = req.body;

  try {
    // Sanitize and prepare the data
    const orderData = {};

    // Sanitize userId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      orderData.userId = mongoose.Types.ObjectId(userId); // Ensure userId is an ObjectId
    } else {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Validate and sanitize products
    if (Array.isArray(products) && products.length > 0) {
      orderData.products = products.map((product) => {
        if (mongoose.Types.ObjectId.isValid(product.productId)) {
          return {
            productId: mongoose.Types.ObjectId(product.productId), // Sanitize productId to ObjectId
            quantity: parseInt(product.quantity, 10) || 1, // Ensure quantity is a number
          };
        } else {
          throw new Error("Invalid productId in products array");
        }
      });
    } else {
      return res
        .status(400)
        .json({ error: "products must be a non-empty array" });
    }

    // Sanitize subtotal and total
    if (typeof subtotal === "number" && subtotal >= 0) {
      orderData.subtotal = parseFloat(subtotal); // Convert to float
    } else {
      return res.status(400).json({ error: "Invalid subtotal" });
    }

    if (typeof total === "number" && total >= 0) {
      orderData.total = parseFloat(total); // Convert to float
    } else {
      return res.status(400).json({ error: "Invalid total" });
    }

    // Optional fields
    if (shipping) orderData.shipping = shipping;
    if (order_status) orderData.order_status = order_status;
    if (payment_status) orderData.payment_status = payment_status;

    // Create the order with sanitized data
    const order = await Order.create(orderData);
    res.status(201).json(order); // Use 201 for created resource
  } catch (error) {
    console.error(error); // Log error for debugging
    if (error.message === "Invalid productId in products array") {
      return res
        .status(400)
        .json({ error: "Invalid productId in products array" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const order = await Order.findOneAndDelete({ _id: id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update order
const updateOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const updateData = {};
    // Only add fields to update if they are present in the request body
    if (req.body.userId)
      updateData.userId = mongoose.Types.ObjectId(req.body.userId);
    if (req.body.products) updateData.products = req.body.products;
    if (req.body.subtotal) updateData.subtotal = parseFloat(req.body.subtotal);
    if (req.body.total) updateData.total = parseFloat(req.body.total);
    if (req.body.shipping) updateData.shipping = req.body.shipping;
    if (req.body.order_status) updateData.order_status = req.body.order_status;
    if (req.body.payment_status)
      updateData.payment_status = req.body.payment_status;

    const order = await Order.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  deleteOrder,
  updateOrder,
};
