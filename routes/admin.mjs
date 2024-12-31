import { Router } from "express";
import { addOffice, deleteCar, deleteCustomer, deleteOffice, addCar, addReservation, deleteReservation, getPayments, getReservationsFiltered, getTotalPaymentAmount, deletePayment } from "../database.mjs";
const admin = Router();

admin.get("/", async (req, res) => res.redirect("/html/Administration.html"));

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
    const { model, year, plateId, price, status, officeId } = req.body;
    console.log(model, year, plateId, price, status, officeId);
    try {
      await addCar(model, year, plateId, price, status, officeId);
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

  admin.post("/payments", async (req, res) => {
    const {startDate, endDate} = req.body;
    try {
      const payments = await getPayments(startDate, endDate);
      res.json(payments);
    } catch (error) {
      console.error("Error in /payments:", error);
      res.status(500).json({ error: "Failed to fetch payments." });
    }
  });

  admin.delete("/payments/:id", async (req, res) => {
    const paymentID = req.params.id;
    try {
      await deletePayment(paymentID);
      res.status(200).json({ message: "Payment deleted successfully!" });
    } catch (error) {
      console.error("Error in /payments/:id:", error);
      res.status(500).json({ error: "Failed to delete payment." });
    }
  });

  admin.post("/paymentsWithinPeriod", async (req, res) => {
    try {
      const {startDate, endDate} = req.body;
      const payments = await getPaymentsWithinPeriod(startDate, endDate);
      res.json(payments);
    } catch (error) {
      console.error("Error in /paymentsWithinPeriod:", error);
      res.status(500).json({ error: "Failed to fetch payments within period." });
    }
  });

  admin.post("/totalPaymentsAmount", async (req, res) => {
    try {
      const {startDate, endDate} = req.body;
      const total_amount = await getTotalPaymentAmount(startDate, endDate);
      res.json(total_amount);
    } catch (error) {
      console.error("Error in /totalPaymentsAmount:", error);
      res.status(500).json({ error: "Failed to fetch total payments amount." });
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

  admin.delete("/reservations/:id", async (req, res) => {
    const id = req.params.id;
    try {
      await deleteReservation(id);
      res.status(200).json({ message: "reservation deleted successfully!" })
    } catch (error) {
      console.error("Error in /admin/reservation:id:",error);
        res.status(500).json({ error: "failed to delete reservation." });
    }
  })
  
  admin.post("/addOffice", async (req, res) => {
    const { name, location, phone, region } = req.body;
    try {
        await addOffice(name, location, phone, region);
        res.status(201).json({ message: "Office added successfully!" });
    } catch (error) {
        console.error("Error in /admin/offinces:", error);
        res.status(500).json({ error: "Failed to add office."});
    }
  })

  admin.post("/reservations", async (req, res) => {
    const { car_id, customer_id, pickup_date, return_date} = req.body;
    try {

      await addReservation(car_id, customer_id, pickup_date, return_date);
      res.status(201).json({ message: "Reservation added successfully!"});
    } catch (error) {
      console.error("Error in /admin/reservations:", error);
        res.status(500).json({ error: "Failed to add reservation."});
    }
  })

  admin.post("/getReservationsFiltered", async(req, res) => {
    const {startDate, endDate, customer_id} = req.body;
    try {
      const reservations = await getReservationsFiltered(startDate, endDate, customer_id);
      res.json(reservations);
    } catch (error) {
      console.error("Error in /reservationsWithinPeriod:", error);
      res.status(500).json({ error: "Failed to fetch reservationsWithinPeriod." });
    }
  })

  admin.get("/customers", async (req, res) => res.redirect("/html/customers.html"));

  admin.get("/offices", async (req, res) => res.redirect("/html/offices.html"));

  admin.get("/cars", async (req, res) => res.redirect("/html/cars.html"));

  admin.get("/reservations", async (req, res) => res.redirect("/html/reservations.html"));
  
  admin.get("/payments", async (req, res) => res.redirect("/html/payments.html"));

export{
    admin
}