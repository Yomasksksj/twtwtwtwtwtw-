const express = require('express');
const app = express();
require('dotenv').config();
const { testConnection } = require('./config/db.config');
const customerRoutes = require('./routes/customerRoutes');
const trackRoutes = require('./routes/trackRoutes');
const producerRoutes = require('./routes/producerRoutes'); // Import rout pre producentov

app.use(express.json());

// Test pripojenia k databáze
testConnection();

app.use('/api/customers', customerRoutes); 
app.use('/api/tracks', trackRoutes); 
app.use('/api/producers', producerRoutes); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Spustenie servera
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;