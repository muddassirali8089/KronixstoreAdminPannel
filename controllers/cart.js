const { db } = require('./db'); // Assuming you have a db module to handle queries

// Fetch cart items for a specific user
const fetchAll = async (req, res) => {
  try {
    const { userId } = req.query;  // userId passed as query parameter

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch cart items from the database for this user
    const [cartItems] = await db.query('SELECT * FROM cart WHERE user_id = ?', [userId]);

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'No items found in cart' });
    }

    return res.status(200).json(cartItems);
  } catch (err) {
    console.error('Error fetching cart items:', err);
    return res.status(500).json({ message: 'Error fetching cart items', error: err.message });
  }
};

// Add an item to the cart
const add = async (req, res) => {
  try {
    const { userId, productId, qty, selectedSize, selectedColor } = req.body;

    if (!userId || !productId || !qty) {
      return res.status(400).json({ message: 'User ID, Product ID, and Quantity are required' });
    }

    // Add item to cart
    const [result] = await db.query(
      'INSERT INTO cart (user_id, product_id, qty, selected_size, selected_color) VALUES (?, ?, ?, ?, ?)',
      [userId, productId, qty, selectedSize, selectedColor]
    );

    return res.status(201).json({ message: 'Item added to cart', itemId: result.insertId });
  } catch (err) {
    console.error('Error adding item to cart:', err);
    return res.status(500).json({ message: 'Error adding item to cart', error: err.message });
  }
};

// Update an item in the cart
const update = async (req, res) => {
  try {
    const { id } = req.params;  // Extract itemId from the route parameter
    const { userId, qty, selectedSize, selectedColor } = req.body;

    if (!userId || !id || !qty) {
      return res.status(400).json({ message: 'User ID, Item ID, and Quantity are required' });
    }

    // Ensure the item exists in the user's cart
    const [existingItem] = await db.query('SELECT * FROM cart WHERE user_id = ? AND id = ?', [userId, id]);

    if (existingItem.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update cart item
    const [result] = await db.query(
      'UPDATE cart SET qty = ?, selected_size = ?, selected_color = ? WHERE user_id = ? AND id = ?',
      [qty, selectedSize, selectedColor, userId, id]
    );

    return res.status(200).json({ message: 'Item updated in cart' });
  } catch (err) {
    console.error('Error updating item in cart:', err);
    return res.status(500).json({ message: 'Error updating item in cart', error: err.message });
  }
};

// Remove an item from the cart
const remove = async (req, res) => {
  try {
    const { id } = req.params;  // Extract itemId from the route parameter
    const { userId } = req.query;  // Extract userId from the query parameters

    if (!userId || !id) {
      return res.status(400).json({ message: 'User ID and Item ID are required' });
    }

    // Ensure the item exists in the user's cart
    const [existingItem] = await db.query('SELECT * FROM cart WHERE user_id = ? AND id = ?', [userId, id]);

    if (existingItem.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item from cart
    const [result] = await db.query('DELETE FROM cart WHERE user_id = ? AND id = ?', [userId, id]);

    return res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing item from cart:', err);
    return res.status(500).json({ message: 'Error removing item from cart', error: err.message });
  }
};

module.exports = {
  add,
  fetchAll,
  remove,
  update
};
