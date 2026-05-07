require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const imageRoutes = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api', imageRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB connection failed:', err.message);
  process.exit(1);
});
