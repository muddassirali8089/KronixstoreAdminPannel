// eslint-disable-next-line import/extensions
const { db } = require('./db');

const getAll = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
};

const getOne = async (req, res) => {
    const { email, password } = req.body;
    const row = await db.query('SELECT * FROM users WHERE email = ? AND paswd = ?', [email, password]);
    res.json({ message: 'Done', data: row[0] });
};

const create = async (req, res) => {
    const { name, email, mobile, status, password } = req.body;

    const nm = name ?? 0;
    const mb = mobile ?? 0;
    const st = status ?? 0;
    const ps = password ?? 0;

    await db.query(
        'INSERT INTO users (name, email, mobile, status, paswd) VALUES (?, ?, ?, ?, ?)',
        [nm, email, mb, st, ps]
    );

    res.json({ message: 'Created' });
};

const update = async (req, res) => {
    const { name, email, password } = req.body;
    await db.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, req.params.id]
    );
    res.json({ message: 'Updated' });
};

const remove = async (req, res) => {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
};
