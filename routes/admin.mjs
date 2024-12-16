import { Router } from "express";
import { addCar, deleteCar, deleteCustomer } from "../database.mjs";
const admin = Router();

admin.get("/customers", async (req, res) => res.redirect("/html/customers.html"));

admin.delete("/customers/:id", async (req, res) => {
    const customerId = req.params.id;
    try{
        await deleteCustomer(customerId);
        res.status(200).json({ message: "Customer deleted successfully!" })
    } catch (error) {
        console.error("Error in /admin/customer:id:",error);
        res.status(500).json({ error: "failed to delete customer." });
    }
});

admin.post("/cars", async (req, res) => {
    const { model, year, plateId, status, officeId } = req.body;
    try {
      await addCar(model, year, plateId, status, officeId);
      res.status(201).json({ message: "Car added successfully!" });
    } catch (error) {
      console.error("Error in /admin/cars:", error);
      res.status(500).json({ error: "Failed to add car." });
    }
  });
  
  admin.delete("/cars/:id", async (req, res) => {
    const carId = req.params.id;
    try {
      await deleteCar(carId);
      res.status(200).json({ message: "Car deleted successfully!" });
    } catch (error) {
      console.error("Error in /admin/cars/:id:", error);
      res.status(500).json({ error: "Failed to delete car." });
    }
  });

export{
    admin
}