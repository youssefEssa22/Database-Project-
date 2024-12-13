const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "carsProject.db");
const SCHEMA_FILE = path.join(__dirname, "schema.sql");

async function initializeDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    console.log("Database file not found. Creating a new database...");
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database,
    });

    // Read and execute the schema.sql file
    if (fs.existsSync(SCHEMA_FILE)) {
      const schema = fs.readFileSync(SCHEMA_FILE, "utf-8");
      await db.exec(schema);
      console.log("Database initialized with schema!");
    } else {
      console.error(`Schema file not found at ${SCHEMA_FILE}`);
      throw new Error("Schema file is required to initialize the database.");
    }

    await db.close();
  } else {
    console.log("Database file found.");
  }
}

async function createConnection() {
  await initializeDatabase();
  const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });
  console.log("Database connected!");
  return db;
}

async function addUser(fname, lname, email, password) {
  const db = await createConnection();
  await db.run(
    `INSERT INTO users (first_name, last_name, email, user_password) VALUES (?, ?, ?, ?)`,
    [fname, lname, email, password]
  );
  console.log("User added!");
  await db.close();
}

async function readCars() {
  const db = await createConnection();
  const cars = await db.all("SELECT * FROM cars");
  console.log("Cars fetched!");
  await db.close();
  return cars;
}

module.exports = { addUser, readCars, initializeDatabase };
