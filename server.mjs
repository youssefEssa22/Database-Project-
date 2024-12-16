import express from "express";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import {
  addCustomer,
  readCars,
  addCar,
  deleteCar,
  addReservation,
  getCustomerReservations,
  getCustomer,
} from "./database.mjs";

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
    const customers = await getCustomer({ email }); // Use a function to get customer by email
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
  const filters = req.query; // Use query parameters for filtering
  try {
    const cars = await readCars();
    res.json(cars);
  } catch (error) {
    console.error("Error in /cars:", error);
    res.status(500).json({ error: "Failed to fetch cars." });
  }
});

// Route: Add a new car (Admin)
app.post("/admin/cars", async (req, res) => {
  const { model, year, plateId, status, officeId } = req.body;
  try {
    await addCar(model, year, plateId, status, officeId);
    res.status(201).json({ message: "Car added successfully!" });
  } catch (error) {
    console.error("Error in /admin/cars:", error);
    res.status(500).json({ error: "Failed to add car." });
  }
});

// Route: Delete a car (Admin)
app.delete("/admin/cars/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    await deleteCar(carId);
    res.status(200).json({ message: "Car deleted successfully!" });
  } catch (error) {
    console.error("Error in /admin/cars/:id:", error);
    res.status(500).json({ error: "Failed to delete car." });
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

app.get("/", (req, res) => {
  res.redirect("/html/Main_Page.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
