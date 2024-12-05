const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carsProject",
});

function addUser(fname, lname, email, password) {
    connection.connect();

    connection.query(
      `INSERT INTO users (first_name, last_name, email, user_password) VALUES (?, ?, ?, ?)`,
      [fname, lname, email, password])

    connection.end();
}


module.exports = { addUser };