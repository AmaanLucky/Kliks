require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const imageRoutes = require('./routes/images');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api', imageRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

connectDB().then(async () => {
  const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
  if (!existing) {
    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log('Admin seeded from env vars');
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('DB connection failed:', err.message);
  process.exit(1);
});
