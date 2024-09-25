/*const Order=require('../models/OrdersModel')
const mongoose=require('mongoose')

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
    const sanitizedUserId = sanitizeUserId(userId);
    const sanitizedProducts = sanitizeProducts(products);
    const sanitizedSubtotal = sanitizeAmount(subtotal);
    const sanitizedTotal = sanitizeAmount(total);

    // Construct a trusted and controlled orderData object with whitelisted fields
    const orderData = {
      userId: sanitizedUserId, // Sanitized ObjectId
      products: sanitizedProducts, // Sanitized products array
      subtotal: sanitizedSubtotal, // Sanitized float
      total: sanitizedTotal, // Sanitized float
      shipping: shipping || undefined, // Optional sanitized field
      order_status: order_status || undefined, // Optional sanitized field
      payment_status: payment_status || undefined, // Optional sanitized field
    };

    // Pass sanitized orderData to create method
    const order = await Order.create(orderData);
    res.status(201).json(order); // Use 201 for created resource
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to sanitize userId
const sanitizeUserId = (userId) => {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    return mongoose.Types.ObjectId(userId); // Convert to ObjectId if valid
  }
  throw new Error("Invalid userId");
};

// Function to sanitize products
const sanitizeProducts = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("products must be a non-empty array");
  }

  return products.map((product) => {
    if (!mongoose.Types.ObjectId.isValid(product.productId)) {
      throw new Error("Invalid productId in products array");
    }
    return {
      productId: mongoose.Types.ObjectId(product.productId), // Sanitize productId to ObjectId
      quantity: parseInt(product.quantity, 10) || 1, // Ensure quantity is a number
    };
  });
};

// Function to sanitize subtotal and total
const sanitizeAmount = (amount) => {
  if (typeof amount === "number" && amount >= 0) {
    return parseFloat(amount); // Convert to float
  }
  throw new Error("Invalid amount");
};

// Delete order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

    const order=await Order.findOneAndDelete({_id:id})

    if(!order){
        return res.status(404).json({error:'no such oerder'})
    }

    res.status(200).json(order)
    
}

//update order
const updateOrder= async(req,res)=>{
    const {id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'no such id'})
    }
    const order =await Order.findOneAndUpdate({_id:id},{
        ...req.body
    })

    if(!order){
        return res.status(404).json({error:'no such oerder'})
    }

    res.status(200).json(order)
}


module.exports={
    creatOrder,
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder
}*/

const Order = require('../models/OrdersModel')
const mongoose = require('mongoose')

// get all orders
const getOrders = async (req, res) => {
    const orders = await Order.find({}).sort({ createAt: -1 })

    res.status(200).json(orders)
}

// get a single order
const getOrder = async (req, res) => {
    const { id } = req.params

    // Validate id to avoid NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such id' })
    }

    try {
        // Sanitize query to prevent NoSQL injection
        const order = await Order.findById(mongoose.Types.ObjectId(id)) // FIX: Use mongoose.Types.ObjectId(id) for parameterized query

        if (!order) {
            return res.status(404).json({ error: 'No such order' })
        }

        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
}

// add an order
const creatOrder = async (req, res) => {
    const { userId, products, subtotal, total, shipping, order_status, payment_status } = req.body

    try {
        const order = await Order.create({ userId, products, subtotal, total, shipping, order_status, payment_status })
        res.status(200).json(order)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}

// delete an order
const deleteOrder = async (req, res) => {
    const { id } = req.params

    // Validate id to avoid NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such id' })
    }

    try {
        // Sanitize query to prevent NoSQL injection
        const order = await Order.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) }) // FIX: Use mongoose.Types.ObjectId(id)

        if (!order) {
            return res.status(404).json({ error: 'No such order' })
        }

        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
}

// update an order
const updateOrder = async (req, res) => {
    const { id } = req.params

    // Validate id to avoid NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such id' })
    }

    try {
        // Sanitize query to prevent NoSQL injection
        const order = await Order.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, {
            ...req.body
        }, { new: true }) // FIX: Use mongoose.Types.ObjectId(id)

        if (!order) {
            return res.status(404).json({ error: 'No such order' })
        }

        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
}

module.exports = {
    creatOrder,
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder
}

