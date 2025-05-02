const { db } = require('./db');

// Utility function for consistent responses
const sendResponse = (res, status, message, data = null) => {
    res.status(status).json({ message, data });
};

const getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM category');
        // sendResponse(res, 200, 'Categories fetched successfully', rows);
        res.status(200).json(rows);
    } catch (err) {
        sendResponse(res, 500, 'Failed to fetch categories', err.message);
    }
};

const getOne = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM category WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return sendResponse(res, 404, 'Category not found');
        }
        return res.status(200).json(rows[0]);
        // return sendResponse(res, 200, 'Category fetched successfully', rows[0]);
    } catch (err) {
        return sendResponse(res, 500, 'Failed to fetch category', err.message);
    }
};

const getSpec = async (req, res) => {
    try {
        const column = req.params.q;
        const allowedColumns = ['name', 'status', 'added_on'];  // Example allowed columns
        if (!allowedColumns.includes(column)) {
            return sendResponse(res, 400, 'Invalid column');
        }

        const [rows] = await db.query(`SELECT \`${column}\` FROM category`);
        return res.status(200).json(rows);
        // return sendResponse(res, 200, `Category ${column} fetched successfully`, rows);
    } catch (err) {
        return sendResponse(res, 500, 'Failed to fetch specified column', err.message);
    }
};

const create = async (req, res) => {
    const { name, status } = req.body;
    if (!name || status === undefined) {
        return sendResponse(res, 400, 'Name and status are required');
    }

    try {
        // Check if category with same name already exists
        const [existing] = await db.query('SELECT id FROM category WHERE name = ?', [name]);

        if (existing.length > 0) {
            return sendResponse(res, 409, 'Category already exists');
        }

        // Insert new category
        await db.query(
            'INSERT INTO category (name, status, added_on) VALUES (?, ?, NOW())',
            [name, status]
        );

        return sendResponse(res, 201, 'Category created successfully');
    } catch (err) {
        return sendResponse(res, 500, 'Failed to create category', err.message);
    }
};

const update = async (req, res) => {
    const { name, status } = req.body;
    if (!name || status === undefined) {
        return sendResponse(res, 400, 'Name and status are required');
    }

    try {
        const [result] = await db.query(
            'UPDATE category SET name = ?, status = ?, added_on = NOW() WHERE id = ?',
            [name, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, 'Category not found');
        }

        return sendResponse(res, 200, 'Category updated successfully');
    } catch (err) {
        return sendResponse(res, 500, 'Failed to update category', err.message);
    }
};

const remove = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM category WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, 'Category not found');
        }

        return sendResponse(res, 200, 'Category deleted successfully');
    } catch (err) {
        return sendResponse(res, 500, 'Failed to delete category', err.message);
    }
};

module.exports = {
    getAll,
    getSpec,
    getOne,
    create,
    update,
    remove
};
