const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  server: process.env.DB_HOST,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create the connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

async function testConnection() {
  try {
    await poolConnect;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

module.exports = {
  sql,
  pool,
  poolConnect,
  testConnection
};