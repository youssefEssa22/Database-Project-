import postgres from 'postgres'
import env from "dotenv"

env.config()
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)


async function addUser(fname, lname, email, password) {
  await sql`
    INSERT INTO users (first_name, last_name, email, user_password) 
    VALUES (${fname}, ${lname}, ${email}, ${password})
  `;
}

async function readCars() {
  const cars = await sql`SELECT * FROM cars`;
  return cars;
}

export { addUser, readCars };
