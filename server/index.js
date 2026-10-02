const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const etherScan = require('./services/etherScan');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eth-trading-bot';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/keys', require('./routes/keys'));
app.use('/api/price', require('./routes/price'));
app.use('/api/trade', require('./routes/trade'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/history', require('./routes/history'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  etherScan.start();
});
