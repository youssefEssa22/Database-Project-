import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import {
  addCustomer,
  readCars,
  addReservation,
  getCustomerReservations,
  getCustomer,
  getCustomers,
  getOffices,
  createReservationAndPayment,
  getCarById,
  searchCars,
  getCustomerById,
  readCustomerCars,
  returnCar,
  getReservations,
  getPayments,
  getRegions,
} from "./database.mjs";
import { admin } from "./routes/admin.mjs";

const app = express();
const port = 3000;

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(root));
app.use(express.json());
app.use('/admin', admin);

// Route: Register a new customer
app.post("/register", async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await addCustomer(name, email, passwordHash, phone, address);
    res.status(201).json({ message: "Customer registered successfully!" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ error: "Failed to register customer." });
  }
});

// Route: Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const customers = await getCustomer(email); // Use a function to get customer by email
    if (customers.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const customer = customers[0];
    const isPasswordValid = await bcrypt.compare(password, customer.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful!", customerId: customer.customer_id });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ error: "Failed to login." });
  }
});

// Route: List available cars with optional filters
app.get("/cars", async (req, res) => {
  try {
    const cars = await readCars();
    res.json(cars);
  } catch (error) {
    console.error("Error in /cars:", error);
    res.status(500).json({ error: "Failed to fetch cars." });
  }
});

app.post("/customerCars", async (req, res) => {
  try {
    const { customerId } = req.body;
    const cars = await readCustomerCars(customerId);
    res.json(cars);
  } catch (error) {
    console.error("Error in /customerCars:", error);
    res.status(500).json({ error: "Failed to fetch cars." });
  }
});

app.get("/SearchCars", async (req, res) => {
  const { start_date, end_date, model, office, order_by } = req.query;
  try {
    const cars = await searchCars(start_date, end_date, model, office, order_by);
    res.json(cars);
  } catch (error) {
    console.error("Error in /searchCars:", error);
    res.status(500).json({ error: "Failed to fetch cars." });
  }

});

app.post("/rentCar", async (req, res) => {
  const { car_id, start_date, end_date, email } = req.body;

  try {
      const days = Math.max(1, (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
      const car = await getCarById(car_id); // Fetch car details
      const amount = car[0].price * days;

      // Create a reservation and payment record
      await createReservationAndPayment(car_id, email, start_date, end_date, amount);

      res.status(200).json({ message: "Car rented successfully!" });
  } catch (error) {
      console.error("Error renting car:", error);
      res.status(500).json({ error: "Failed to rent car." });
  }
});

app.get("/customers", async (req, res) =>{
  try {
    const customers = await getCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error in /customers:", error);
    res.status(500).json({ error: "Failed to fetch customers." });
  }
});

app.get("/offices", async (req, res) =>{
  try {
    const offices = await getOffices();
    res.json(offices);
  } catch (error) {
    console.error("Error in /offices:", error);
    res.status(500).json({ error: "failed to fetch offices"});
  }
});

// Route: Add a reservation
app.post("/reservations", async (req, res) => {
  const { carId, customerId, officeId, pickupDate, returnDate } = req.body;
  try {
    await addReservation(carId, customerId, officeId, pickupDate, returnDate);
    res.status(201).json({ message: "Reservation created successfully!" });
  } catch (error) {
    console.error("Error in /reservations:", error);
    res.status(500).json({ error: "Failed to create reservation." });
  }
});

app.get("/reservations", async (req, res) => {
  try {
    const reservations = await getReservations();
    res.json(reservations);
  } catch (error) {
    console.error("Error in /reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations." });
  }
});

app.get("payments", async (req, res) => {
  try {
    const payments = await getPayments();
    res.json(payments);
  } catch (error) {
    console.error("Error in /payments:", error);
    res.status(500).json({ error: "Failed to fetch payments." });
  }
});
// Route: Get reservations for a customer
app.get("/customers/:id/reservations", async (req, res) => {
  const customerId = req.params.id;
  try {
    const reservations = await getCustomerReservations(customerId);
    res.json(reservations);
  } catch (error) {
    console.error("Error in /customers/:id/reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations." });
  }
});

app.post("/customer", async (req, res) => {
  const { customerId } = req.body;
  try {
    const customer = await getCustomerById(customerId); 

    res.json(customer)
  } catch (error) {
    console.error("Error in /customer:", error);
    res.status(500).json({ error: "Failed to fetch customer info." });
  }
});

app.post("/returnCar", async (req, res) => {
  try {
    const { reservation_id } = req.body;
    await returnCar(reservation_id);
    res.status(201).json({ message: "Car returned successfully!" });
  } catch (error) {
    console.error("Error in /returnCar:", error);
    res.status(500).json({ error: "Failed to return a car." });
  }
});

app.get("/regions", async (req, res) => { 
  try {
    const regions = await getRegions();
    res.json(regions);
  } catch (error) {
    console.error("Error in /regions:", error);
    res.status(500).json({ error: "Failed to fetch regions." });
  }
})

app.get("/", (req, res) => {
  res.redirect("/html/Main_Page.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
