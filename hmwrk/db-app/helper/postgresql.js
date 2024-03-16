const { Pool } = require('pg');

const pool = new Pool({
  user: 'user', 
  host: 'postgres_db', 
  database: 'app-odev', 
  password: 'password', 
  port: 5432, 
  max: 100, 
});

module.exports = pool;