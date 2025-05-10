const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cart');
const itemRouter = require('./routes/itemsRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

console.log('Serving static files from:', path.join(__dirname, 'uploads'));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // or 20mb, 50mb
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRouter);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/images', imageRoutes);



app.listen(3030, () => console.log('Server running on port 3030'));


const db = require('./controllers/db');

app.get('/test-db', async (req, res) => {
  try {
    console.log("connected to the database..");
    
    res.send("connected to the database....");
  } catch (err) {
    console.error('DB test error:', err);
    res.status(500).send('Database connection failed');
  }
});

