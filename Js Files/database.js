const { query } = require("express");
const mysql = require("mysql2/promise");

async function createConnection() {
  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "carsProject",
  });
  console.log("Database connected!");

  return connection;
}

async function addUser(fname, lname, email, password) {
  const connection = await createConnection();
  await connection.execute(
    `INSERT INTO users (first_name, last_name, email, user_password) VALUES (?, ?, ?, ?)`,
    [fname, lname, email, password]
  );

  connection.end();
}

async function readCars() {
  const connection = await createConnection();
  const [cars] = await connection.execute("SELECT * FROM cars");
  // console.log(cars)
  connection.end();
  return cars;
}

module.exports = { addUser, readCars };
