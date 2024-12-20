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
async function readCars() {
  try {
    const cars = await sql`
      SELECT * FROM cars
    `;
    return cars;
  } catch (error) {
    console.error("Error in readCars:", error);
    throw error;
  }
}

// Insert a new car
async function addCar(model, year, plateId, price, status = "active", officeId) {
  console.log(model, year, plateId, price, status, officeId);
  try {
    await sql`
      INSERT INTO cars (model, year, plate_id, price, status, office_id)
      VALUES (${model}, ${year}, ${plateId}, ${price}, ${status}, ${officeId})
    `;
  } catch (error) {
    console.error("Error in addCar:", error);
    throw error;
  }
}

async function getCarById(id) {
  try {
    const cars = await sql`
      SELECT * FROM cars WHERE car_id = ${id}
    `;
    return cars;
  } catch (error) {
    console.error("Error in getCarsById:", error);
    throw error;
  }
}

async function searchCars(start_date, end_date, model, office, order_by) {
  try {
    // Base query
    let query = `
      SELECT cars.*, offices.name AS office_name
      FROM cars
      LEFT JOIN offices ON cars.office_id = offices.office_id
      WHERE 1 = 1
    `;

    const conditions = [];
    const params = [];

    // Exclude cars reserved during the specified period
    if (start_date) {
      conditions.push(`
        NOT EXISTS (
          SELECT 1
          FROM reservations
          WHERE cars.car_id = reservations.car_id
          AND $${params.length + 1} < reservations.return_date
        )
      `);
      params.push(start_date);
    }

    if (end_date) {
      conditions.push(`
        NOT EXISTS (
          SELECT 1
          FROM reservations
          WHERE cars.car_id = reservations.car_id
          AND reservations.pickup_date < $${params.length + 1}
        )
      `);
      params.push(end_date);
    }

    // Filter by model
    if (model) {
      conditions.push(`LOWER(cars.model) LIKE LOWER($${params.length + 1})`);
      params.push(`%${model}%`);
    }

    // Filter by office
    if (office) {
      conditions.push(`LOWER(offices.name) LIKE LOWER($${params.length + 1})`);
      params.push(`%${office}%`);
    }

    // Add all conditions to the query
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    // Order by valid columns
    const validColumns = ["price", "model", "year"];
    if (order_by && validColumns.includes(order_by)) {
      query += ` ORDER BY ${order_by}`;
    }

    // Execute the query with parameters
    const cars = await sql.unsafe(query, params);
    return cars;
  } catch (error) {
    console.error("Error in searchCars:", error);
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

async function createReservationAndPayment(carId, email, startDate, endDate, amount) {
  const sql = postgres(connectionString);

  try {
    // Begin a transaction
    await sql.begin(async (transaction) => {
      // Step 1: Find the customer ID based on the email
      const customer = await transaction`
        SELECT customer_id FROM customers WHERE email = ${email}
      `;
      if (customer.length === 0) {
        throw new Error("Customer not found.");
      }
      const customerId = customer[0].customer_id;

      // Step 2: Check if the car is already reserved during the specified period
      const overlappingReservations = await transaction`
        SELECT * FROM reservations
        WHERE car_id = ${carId}
          AND (
            (pickup_date <= ${endDate} AND return_date >= ${startDate})
          )
      `;
      if (overlappingReservations.length > 0) {
        throw new Error("Car is already reserved during the specified period.");
      }

      // Step 3: Insert the reservation
      const reservation = await transaction`
        INSERT INTO reservations (car_id, customer_id, pickup_date, return_date)
        VALUES (${carId}, ${customerId}, ${startDate}, ${endDate})
        RETURNING reservation_id
      `;
      const reservationId = reservation[0].reservation_id;

      // Step 4: Insert the payment
      await transaction`
        INSERT INTO payments (reservation_id, amount, payment_method)
        VALUES (${reservationId}, ${amount}, 'credit_card')
      `;
    });

    console.log("Reservation and payment created successfully.");
  } catch (error) {
    console.error("Error in createReservationAndPayment:", error);
    throw error; // Transaction will automatically roll back
  }
}

// Create a new reservation
async function addReservation(carId, customerId, pickupDate, returnDate) {
  try {
    await sql`
      INSERT INTO reservations (car_id, customer_id, pickup_date, return_date)
      VALUES (${carId}, ${customerId}, ${pickupDate}, ${returnDate})
    `;
  } catch (error) {
    console.error("Error in addReservation:", error);
    throw error;
  }
}

async function deleteReservation(id) {
  try {
    await sql`DELETE FROM reservations WHERE id = ${id}`
  } catch (error) {
    console.error("Error in deleteReservation:", error);
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
  addOffice,
  deleteReservation,
  createReservationAndPayment,
  getCarById,
  searchCars
};