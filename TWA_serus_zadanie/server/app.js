const express = require('express');
const app = express();
require('dotenv').config();
const { testConnection } = require('./config/db.config');
const customerRoutes = require('./routes/customerRoutes');
const trackRoutes = require('./routes/trackRoutes');

app.use(express.json());

// či databaza povie serus
testConnection();

// routy
app.use('/api', customerRoutes);
app.use('/api', trackRoutes);

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; 