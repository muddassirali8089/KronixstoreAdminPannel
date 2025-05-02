const express = require('express');
const controller = require('../controllers/category');

const router = express.Router();

router.get('/', controller.getAll); // GET / — fetch all items

router.get('/id/:id', controller.getOne); // GET /id/123 — fetch by ID
router.get('/query/:q', controller.getSpec); // GET /query/shoes — fetch by some query

router.post('/', controller.create); // POST / — create a new item
router.put('/:id', controller.update); // PUT /123 — update by ID
router.delete('/:id', controller.remove); // DELETE /123 — delete by ID

module.exports = router;

/*
axios.get('https://api.kronixstore.com/api/items'); // all items
axios.get('https://api.kronixstore.com/api/items/id/123'); // get by ID
axios.get('https://api.kronixstore.com/api/items/query/shoes'); // search for something
axios.post('https://api.kronixstore.com/api/items', newData); // create
axios.put('https://api.kronixstore.com/api/items/123', updatedData); // update
axios.delete('https://api.kronixstore.com/api/items/123'); // delete
*/
