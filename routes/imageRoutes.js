const express = require('express');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/image');

const router = express.Router();

// Serve images from /uploads/items
router.get('/serve/:filename', (req, res) => {
  const {filename} = req.params;
  const imagePath = path.join(__dirname, '..', 'public', 'uploads', 'items', filename);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  return res.sendFile(imagePath);
});

// Image management (optional if needed)
router.get('/', controller.getAll);           // GET all image records (if stored in DB)
router.get('/id/:id', controller.getOne);     // GET image info by DB ID
router.get('/query/:q', controller.getSpec);  // Filter images (if applicable)
router.post('/', controller.create);          // Upload and store image
router.put('/:id', controller.update);        // Update image metadata
router.delete('/:id', controller.remove);     // Delete image

module.exports = router;
