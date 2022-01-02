const express = require('express');

const {createProduct, getAllProducts , updateProducts, deleteProducts} = require('../controller/productController');
const { authorizeRole } = require('../controller/userController');
const isAuthenticatedUser = require('../middleware/isAuthenticated');


const router = express.Router();

// route for access all Products
router.route("/products").get(getAllProducts);

// route for create new Product -- admin user required 
router.route("/product/new").post(isAuthenticatedUser,authorizeRole("admin") , createProduct);

// route for update product -- admin user required
router.route("/product/:id").put(isAuthenticatedUser,authorizeRole("admin") , updateProducts);

// route for delete product -- admin user required
router.route("/product/:id").delete(isAuthenticatedUser,authorizeRole("admin") , deleteProducts);


module.exports = router