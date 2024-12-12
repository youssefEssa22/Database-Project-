const { addUser, readCars } = require("./database");

const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

root = path.join(__dirname, "..");

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
  res.redirect("/Html Files/Main_Page.html")
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
