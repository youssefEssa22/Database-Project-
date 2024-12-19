import postgres from 'postgres'
import env from "dotenv"

env.config()
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

async function addCustomer(name, email, passwordHash, phone, address) {
  try {
    await sql`
      INSERT INTO customers (name, email, password_hash, phone, address)
      VALUES (${name}, ${email}, ${passwordHash}, ${phone}, ${address})
    `;
  } catch (error) {
    console.error("Error in addCustomer:", error);
    throw error;
  }
}

async function getCustomer(email) {
  try {
    await sql`
      SELECT * FROM customers WHERE email = ${email}
    `;
  } catch (error) {
    console.error("Error in getCustomer:", error);
    throw error;
  }
}

async function getCustomers() {
  try {
    const customers = await sql`
      SELECT * FROM customers`;
    return customers
  } catch (error) {
    console.error("Error in getCustomer:", error);
    throw error;
  }
}

async function deleteCustomer(id) {
  try {
    await sql`DELETE FROM customers WHERE customer_id = ${id}`;
  } catch (error){
    console.log("Error in deleteCustomer", error);
    throw error;
  }
}

// Read all available cars (with optional filters and sorting)
async function readCars(filters = {}, sortBy = "model") {
  const { model, year, status, officeId } = filters;

  try {
    const cars = await sql`
      SELECT * FROM cars
      WHERE
        (${model} IS NULL OR model = ${model}) AND
        (${year} IS NULL OR year = ${year}) AND
        (${status} IS NULL OR status = ${status}) AND
        (${officeId} IS NULL OR office_id = ${officeId})
      ORDER BY ${sql(sortBy)}
    `;
    return cars;
  } catch (error) {
    console.error("Error in readCars:", error);
    throw error;
  }
}

// Insert a new car
async function addCar(model, year, plateId, status = "active", officeId) {
  try {
    await sql`
      INSERT INTO cars (model, year, plate_id, status, office_id)
      VALUES (${model}, ${year}, ${plateId}, ${status}, ${officeId})
    `;
  } catch (error) {
    console.error("Error in addCar:", error);
    throw error;
  }
}

// Delete a car by ID
async function deleteCar(carId) {
  try {
    await sql`
      DELETE FROM cars WHERE car_id = ${carId}
    `;
  } catch (error) {
    console.error("Error in deleteCar:", error);
    throw error;
  }
}

async function getOffices() {
  try {
    const customers = await sql`
      SELECT * FROM offices`;
    return customers
  } catch (error) {
    console.error("Error in getOffices:", error);
    throw error;
  }
}

async function deleteOffice(id) {
  try {
    await sql`DELETE FROM offices WHERE office_id = ${id}`;
  } catch (error){
    console.log("Error in deleteOffice", error);
    throw error;
  }
}

async function addOffice(name, location, phone) {
  try {
    await sql`
    INSERT INTO offices (name, location, phone)
    VALUES (${name}, ${location}, ${phone})
    `;
  } catch (error) {
    console.error("Error in aaddOffice:", error);
    throw error;
  }
}

// Create a new reservation
async function addReservation(carId, customerId, officeId, pickupDate, returnDate) {
  try {
    await sql`
      INSERT INTO reservations (car_id, customer_id, office_id, pickup_date, return_date)
      VALUES (${carId}, ${customerId}, ${officeId}, ${pickupDate}, ${returnDate})
    `;
  } catch (error) {
    console.error("Error in addReservation:", error);
    throw error;
  }
}

// Fetch all reservations within a specified period
async function getReservationsWithinPeriod(startDate, endDate) {
  try {
    const reservations = await sql`
      SELECT r.*, c.model, c.plate_id, cu.name AS customer_name, cu.email AS customer_email
      FROM reservations r
      JOIN cars c ON r.car_id = c.car_id
      JOIN customers cu ON r.customer_id = cu.customer_id
      WHERE r.reservation_date BETWEEN ${startDate} AND ${endDate}
    `;
    return reservations;
  } catch (error) {
    console.error("Error in getReservationsWithinPeriod:", error);
    throw error;
  }
}

// Fetch the status of all cars on a specific day
async function getCarStatusByDay(date) {
  try {
    const cars = await sql`
      SELECT c.car_id, c.model, c.plate_id, c.status
      FROM cars c
      LEFT JOIN reservations r ON c.car_id = r.car_id
      WHERE r.pickup_date <= ${date} AND r.return_date >= ${date}
      OR c.status NOT IN ('rented')
    `;
    return cars;
  } catch (error) {
    console.error("Error in getCarStatusByDay:", error);
    throw error;
  }
}

// Fetch reservations of a specific customer
async function getCustomerReservations(customerId) {
  try {
    const reservations = await sql`
      SELECT r.*, c.model, c.plate_id
      FROM reservations r
      JOIN cars c ON r.car_id = c.car_id
      WHERE r.customer_id = ${customerId}
    `;
    return reservations;
  } catch (error) {
    console.error("Error in getCustomerReservations:", error);
    throw error;
  }
}

// Fetch daily payments within a specific period
async function getDailyPayments(startDate, endDate) {
  try {
    const payments = await sql`
      SELECT p.payment_date, SUM(p.amount) AS total_payments
      FROM payments p
      WHERE p.payment_date BETWEEN ${startDate} AND ${endDate}
      GROUP BY p.payment_date
      ORDER BY p.payment_date
    `;
    return payments;
  } catch (error) {
    console.error("Error in getDailyPayments:", error);
    throw error;
  }
}

// Add a payment for a reservation
async function addPayment(reservationId, amount, paymentMethod = "credit_card") {
  try {
    await sql`
      INSERT INTO payments (reservation_id, amount, payment_method)
      VALUES (${reservationId}, ${amount}, ${paymentMethod})
    `;
  } catch (error) {
    console.error("Error in addPayment:", error);
    throw error;
  }
}

export {
  addCustomer,
  readCars,
  addCar,
  deleteCar,
  addReservation,
  getReservationsWithinPeriod,
  getCarStatusByDay,
  getCustomerReservations,
  getDailyPayments,
  addPayment,
  getCustomer,
  getCustomers,
  deleteCustomer,
  getOffices,
  deleteOffice,
  addOffice
};