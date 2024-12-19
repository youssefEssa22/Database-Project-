import { Router } from "express";
import { addOffice, deleteCar, deleteCustomer, deleteOffice } from "../database.mjs";
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

  admin.delete("/offices/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await deleteOffice(id);
        res.status(200).json({ message: "office deleted successfully!" })
    } catch (error) {
        console.error("Error in /admin/office:id:",error);
        res.status(500).json({ error: "failed to delete office." });
    }    
  })
  
  admin.post("/offices", async (req, res) => {
    const { name, location, phone } = req.body;
    try {
        await addOffice(name, location, phone);
        res.status(201).json({ message: "Office added successfully!" });
    } catch (error) {
        console.error("Error in /admin/offinces:", error);
        res.status(500).json({ error: "Failed to add office."});
    }
  })

export{
    admin
}