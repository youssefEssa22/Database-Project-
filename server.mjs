import { addUser, readCars } from "./database.mjs";

import express from "express"
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(root));
app.use(express.json());

app.post("/register", (req, res) => {
  const { fname, lname, email, password } = req.body;
  console.log(req.body);
  addUser(fname, lname, email, password);
});

app.get("/cars", async (req, res) => {
  const cars = await readCars();
  res.json(cars);
});

app.get("/", (req, res) => {
  res.redirect("/html/Main_Page.html")
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
