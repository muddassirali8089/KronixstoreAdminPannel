const fs = require('fs');
const path = require('path');
const { db } = require('./db'); // Optional if you're storing image metadata

// 🔧 Save base64 image to /public/uploads/items/
const saveImage = (base64, prefix = 'img') => {
  const match = base64.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error('Invalid base64 format');

  const ext = match[1].split('/')[1];
  const data = match[2];
  const filename = `${prefix}_${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'items');

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, Buffer.from(data, 'base64'));

  return `/uploads/items/${filename}`;
};

// ✅ Get all (optional, only if you store image metadata in DB)
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM images');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get one image metadata by ID
const getOne = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Filter or special query
const getSpec = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT ${req.params.q} FROM images`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create: store image and metadata
const create = async (req, res) => {
  const { image, label } = req.body;
  if (!image) return res.status(400).json({ message: 'Image is required' });

  try {
    const filePath = saveImage(image);
    
    // Optional DB insert
    const [result] = await db.query('INSERT INTO images (path, label) VALUES (?, ?)', [filePath, label || '']);
    
    return res.status(201).json({ message: 'Image uploaded', path: filePath, id: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// ✅ Update image metadata only (not the file)
const update = async (req, res) => {
  const { label } = req.body;
  try {
    await db.query('UPDATE images SET label = ? WHERE id = ?', [label, req.params.id]);
    res.json({ message: 'Image metadata updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// ✅ Delete image (DB record + file)
const remove = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });

    const imagePath = path.join(process.cwd(), 'public', rows[0].path);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await db.query('DELETE FROM images WHERE id = ?', [req.params.id]);

    return res.json({ message: 'Image deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

module.exports = {
  getAll,
  getOne,
  getSpec,
  create,
  update,
  remove,
};
