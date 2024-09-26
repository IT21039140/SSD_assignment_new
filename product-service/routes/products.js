const express = require("express");
const router = express.Router();
const {
  getProducts,
  getOneProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const csrf = require("csurf");
// Middleware for CSRF protection
const csrfProtection = csrf({ cookie: true });

// Add CSRF token validation to routes that modify resources
router.post("/", csrfProtection, addProduct);
router.delete("/:id", csrfProtection, deleteProduct);
router.put("/:id", csrfProtection, updateProduct);
router.get("/", getProducts);
router.get("/:id", getOneProduct);

module.exports = router;
