const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "dbms",
  password: "ApJaRe@mysql#1947",
});

module.exports = db;