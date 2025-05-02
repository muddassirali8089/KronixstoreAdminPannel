const { db } = require('./db');

const getAll = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM orders');
  res.json(rows);
};

const getOne = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
};

const create = async (req, res) => {
  const { uid, payments_status, status, payment_method, total_price, added_on } = req.body;
  await db.query(
    'INSERT INTO orders (uid, payments_status, status, payment_method, total_price, added_on) VALUES (?, ?, ?, ?, ?, ?)',
    [uid, payments_status, status, payment_method, total_price, added_on]
  );
  res.json({ message: 'Created' });
};

const update = async (req, res) => {
  const { uid, payments_status, status, payment_method, total_price, added_on } = req.body;
  await db.query(
    'UPDATE orders SET uid = ?, payments_status = ?, status = ?, payment_method = ?, total_price = ?, added_on = ? WHERE id = ?',
    [uid, payments_status, status, payment_method, total_price, added_on, req.params.id]
  );
  res.json({ message: 'Updated' });
};

const remove = async (req, res) => {
  await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
