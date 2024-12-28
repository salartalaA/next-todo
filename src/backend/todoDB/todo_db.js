require("dotenv").config();

const mysql = require("mysql2/promise");

const todo_db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo_db",
});

module.exports = todo_db;
