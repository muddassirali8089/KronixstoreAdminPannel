const fs = require('fs');
const path = require('path');
const { db } = require('./db');

// Helper: upload base64 image
const uploadBase64Image = (base64Data, filenamePrefix = 'img') => {
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;
  console.log(matches);

  const ext = matches[1].split('/')[1];
  const data = matches[2];
  const filename = `${filenamePrefix}_${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'items');
  console.log(filename);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, Buffer.from(data, 'base64'));

  return `/uploads/items/${filename}`;
};

// Get all items
const getAll = async (req, res) => {
  try {
    // Fetch all items
    const [items] = await db.query('SELECT * FROM items');

    console.log(items);
    
    if (!items.length) return res.status(404).json({ message: 'No items found' });

    // Fetch categories
    const [categories] = await db.query('SELECT id, name FROM category');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });

    // Prepare item ids for fetching sizes and variations
    const itemIds = items.map(item => item.id);

    // Fetch variations
    const [variations] = await db.query(
      'SELECT color, color_code, image, p_id FROM items_variation WHERE p_id IN (?)',
      [itemIds]
    );

    // Fetch sizes
    const [sizes] = await db.query(
      'SELECT size, p_id FROM items_size WHERE p_id IN (?)',
      [itemIds]
    );

    // Process items
    const result = items.map(item => {
      const itemVariations = variations.filter(v => Number(v.p_id) === Number(item.id));
      console.log(variations);
      console.log(itemVariations);
      console.log(item.id);
      variations.filter(v => console.log(v.p_id));

      const itemSizes = sizes
        .filter(s => Number(s.p_id) === Number(item.id))
        .map(s => s.size.toLowerCase());

      // Parse images if stored as JSON string
      try {
        if (typeof item.images === 'string') item.images = JSON.parse(item.images);
        if (typeof item.thumb_images === 'string') item.thumb_images = JSON.parse(item.thumb_images);
      } catch (err) {
        console.warn('Could not parse image fields as JSON:', err);
      }

      return {
        ...item,
        category: categoryMap[item.category] || item.category,
        variations: itemVariations,
        sizes: itemSizes,
        images: item.images || [],
        thumb_images: item.thumb_images || [],
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching items:', err);
    return res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
};




const getOne = async (req, res) => {

  console.log("api hit for getone item........");
  
  try {
    const itemId = req.params.id;

    // Fetch item
    const [items] = await db.query('SELECT * FROM items WHERE id = ?', [itemId]);
    if (!items.length) return res.status(404).json({ message: 'Item not found' });

    const item = items[0];

    // Parse images if stored as JSON string
    try {
      if (typeof item.images === 'string') item.images = JSON.parse(item.images);
      if (typeof item.thumb_images === 'string') item.thumb_images = JSON.parse(item.thumb_images);
    } catch (err) {
      console.warn('Could not parse image fields as JSON:', err);
    }

    // Fetch sizes
    const [sizes] = await db.query(
      'SELECT size FROM items_size WHERE p_id = ?',
      [itemId]
    );
    item.sizes = sizes.map((row) => row.size);

    // Fetch variations
    const [variations] = await db.query(
      'SELECT color, color_code, image FROM items_variation WHERE p_id = ?',
      [itemId]
    );
    item.variations = variations;

    return res.status(200).json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    return res.status(500).json({ message: 'Error fetching item', error: err.message });
  }
};


const create = async (req, res) => {
  console.log(req.body);
  const {
    name, price, mrp, status, description, images, category, gender,
    type, is_new, sale, rate, brand, sold, qty, min_qty,
    thumb_images, action, slug, variations = [], sizes = []
  } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Process main images
    const imagePaths = Array.isArray(images)
      ? images.map(img => uploadBase64Image(img, 'main')).filter(Boolean)
      : [];

    // Insert main item with proper values (not hardcoded strings)
    const [result] = await connection.query(
      `INSERT INTO items (
        name, price, mrp, added_on, status, description, images,
        category, gender, type, is_new, sale, rate, brand,
        sold, qty, min_qty, thumb_images, action, slug
      ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        price, 
        mrp, 
        status ? 1 : 0,
        description, 
        JSON.stringify(imagePaths),
        category, 
        gender, 
        type || '',
        is_new ? 1 : 0,
        sale ? 1 : 0,
        rate || 0,
        brand || '',
        sold || 0,
        qty || 0,
        min_qty || 0,
        JSON.stringify(thumb_images || []),
        action || '',
        slug || ''
      ]
    );

    const itemId = result.insertId;

    // Save variations if they exist
    if (variations && variations.length > 0) {
      await Promise.all(variations.map(async (v) => {
        if (v.color && v.color_code) {
          const varImage = v.image ? uploadBase64Image(v.image, 'var') : '';
          await connection.query(
            `INSERT INTO items_variation (p_id, color, color_code, color_image, image) VALUES (?, ?, ?, ?, ?)`,
            [itemId, v.color, v.color_code, varImage, varImage]
          );
        }
      }));
    }

    // Save sizes if they exist
    if (sizes && sizes.length > 0) {
      await Promise.all(sizes.map(async (s) => {
        if (s) {
          await connection.query(
            `INSERT INTO items_size (p_id, size) VALUES (?, ?)`,
            [itemId, s]
          );
        }
      }));
    }

    await connection.commit();
    res.status(201).json({ message: 'Item created', id: itemId });
  } catch (err) {
    await connection.rollback();
    console.error('Database error:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Item with this name already exists' });
    }
    
    res.status(500).json({ 
      message: 'Error creating item', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    connection.release();
  }
};

// ✅ UPDATE ITEM
const update = async (req, res) => {
  const {
    name, price, mrp, status, description, images, category, gender,
    type, is_new, sale, rate, brand, sold, qty, min_qty,
    thumb_images, action, slug, variations = [], sizes = []
  } = req.body;

  try {
    // Get existing images
    const [rows] = await db.query('SELECT images FROM items WHERE id = ?', [req.params.id]);
    const existingImages = JSON.parse(rows[0]?.images || '[]');

    let updatedImages = existingImages;

    // If new base64 images are provided
    if (Array.isArray(images) && images.length > 0 && images[0].startsWith('data:')) {
      // Remove old images (optional)
      existingImages.forEach(imgPath => {
        const fullPath = path.join(process.cwd(), 'public', imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      // Save new ones
      updatedImages = images.map(img => uploadBase64Image(img, 'main')).filter(Boolean);
    }

    await db.query(
      `UPDATE items SET
        name = ?, price = ?, mrp = ?, status = ?, description = ?, images = ?,
        category = ?, gender = ?, type = ?, is_new = ?, sale = ?, rate = ?, brand = ?,
        sold = ?, qty = ?, min_qty = ?, thumb_images = ?, action = ?, slug = ?
      WHERE id = ?`,
      [
        name, price, mrp, status, description, JSON.stringify(updatedImages),
        category, gender, 'type', 'is_new', 'sale', 'rate', 'brand',
        'sold', qty, min_qty, JSON.stringify(updatedImages), 'action', 'slug',
        req.params.id
      ]
    );
    await db.query('DELETE FROM items_variation WHERE p_id = ?', [req.params.id]);
    await db.query('DELETE FROM items_size WHERE p_id = ?', [req.params.id]);

    // Insert new variations
    if (Array.isArray(variations)) {
      await Promise.all(
        variations.map(async (v) => {
          const varImage = v.image ? uploadBase64Image(v.image, 'var') : '';
          await db.query(
            'INSERT INTO items_variation (p_id, color, color_code, image) VALUES (?, ?, ?, ?)',
            [req.params.id, v.color, v.color_code, varImage]
          );
        })
      );
    }

    // Insert new sizes
    if (Array.isArray(sizes)) {
      await Promise.all(
        sizes.map(async (s) => {
          await db.query(
            'INSERT INTO items_size (p_id, size) VALUES (?, ?)',
            [req.params.id, s]
          );
        })
      );
    }
    res.json({ message: 'Item updated', images: updatedImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating item', error: err.message });
  }
};


// Delete item
const remove = async (req, res) => {
  try {
    await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    await db.query('DELETE FROM items_size WHERE p_id = ?', [req.params.id]);
    await db.query('DELETE FROM items_variation WHERE p_id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting item' });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
