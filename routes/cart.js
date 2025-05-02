const express = require('express');
const controller = require('../controllers/cart');

const router = express.Router();

// Route to fetch all cart items for a user
router.get('/', controller.fetchAll);

// Route to add an item to the cart
router.post('/', controller.add);

// Route to update an item in the cart (requires itemId and userId in body)
router.put('/:id', controller.update);  // Use dynamic 'id' for itemId

// Route to remove an item from the cart (requires itemId and userId as query parameters)
router.delete('/:id', controller.remove);  // Use dynamic 'id' for itemId

module.exports = router;
