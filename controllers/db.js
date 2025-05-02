const mysql = require('mysql2/promise');
const dotenv = require("dotenv");

dotenv.config({ path: "C:\\Users\\ayanp\\Pictures\\material-kit-react-main\\controllers\\.env" });
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWRD,
  database: process.env.DB_NAME,
});

module.exports = { db };
