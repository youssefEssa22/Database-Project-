-- Sample Data for Car Rental System

-- Offices Data
INSERT INTO offices (name, location, phone) VALUES
('Downtown Branch', 'Cairo Downtown, Egypt', '+20123456789'),
('Airport Branch', 'Cairo International Airport, Egypt', '+20123456790'),
('Alexandria Branch', 'Alexandria Corniche, Egypt', '+20123456791'),
('Giza Branch', 'Giza Square, Egypt', '+20123456792'),
('Hurghada Branch', 'Hurghada Marina, Egypt', '+20123456793');

-- Cars Data
INSERT INTO cars (model, year, plate_id, status, office_id, price) VALUES
-- Downtown Branch Cars
('Toyota Corolla', 2023, 'CAI-1234', 'active', 1, 150.00),
('Honda Civic', 2022, 'CAI-5678', 'active', 1, 160.00),
('Hyundai Elantra', 2023, 'CAI-9012', 'rented', 1, 140.00),

-- Airport Branch Cars
('BMW 3 Series', 2023, 'AIR-1234', 'active', 2, 250.00),
('Mercedes C-Class', 2022, 'AIR-5678', 'out_of_service', 2, 270.00),
('Audi A4', 2023, 'AIR-9012', 'active', 2, 260.00),

-- Alexandria Branch Cars
('Kia Cerato', 2022, 'ALX-1234', 'active', 3, 130.00),
('Nissan Sentra', 2023, 'ALX-5678', 'rented', 3, 140.00),
('Chevrolet Cruze', 2022, 'ALX-9012', 'active', 3, 135.00),

-- Giza Branch Cars
('Volkswagen Passat', 2023, 'GIZ-1234', 'active', 4, 180.00),
('Skoda Octavia', 2022, 'GIZ-5678', 'active', 4, 170.00),
('Peugeot 508', 2023, 'GIZ-9012', 'out_of_service', 4, 175.00),

-- Hurghada Branch Cars
('Renault Megane', 2022, 'HUR-1234', 'active', 5, 145.00),
('Fiat Tipo', 2023, 'HUR-5678', 'rented', 5, 135.00),
('Opel Astra', 2022, 'HUR-9012', 'active', 5, 140.00);

-- Customers Data
INSERT INTO customers (name, email, phone, password_hash, address, created_at) VALUES
('Ahmed Mohamed', 'ahmed.mohamed@email.com', '+20101234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Nasr City, Cairo', '2023-01-15 10:00:00'),
('Sara Ahmed', 'sara.ahmed@email.com', '+20111234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Maadi, Cairo', '2023-02-20 11:30:00'),
('Mohamed Ibrahim', 'mohamed.ibrahim@email.com', '+20121234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Smouha, Alexandria', '2023-03-25 09:15:00'),
('Nour Hassan', 'nour.hassan@email.com', '+20131234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Dokki, Giza', '2023-04-10 14:20:00'),
('Yasser Ali', 'yasser.ali@email.com', '+20141234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'El Gouna, Hurghada', '2023-05-05 16:45:00'),
('Mariam Khalil', 'mariam.khalil@email.com', '+20151234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Heliopolis, Cairo', '2023-06-12 13:10:00'),
('Omar Farouk', 'omar.farouk@email.com', '+20161234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Miami, Alexandria', '2023-07-18 12:00:00'),
('Laila Mahmoud', 'laila.mahmoud@email.com', '+20171234567', '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Mohandessin, Giza', '2023-08-22 10:30:00');

-- Reservations Data (Including past, current, and future reservations)
INSERT INTO reservations (car_id, customer_id, reservation_date, pickup_date, return_date) VALUES
-- Past Reservations
(1, 1, '2023-11-01 10:00:00', '2023-11-05', '2023-11-08'),
(4, 2, '2023-11-10 11:00:00', '2023-11-15', '2023-11-18'),
(7, 3, '2023-11-20 09:00:00', '2023-11-25', '2023-11-28'),

-- Current Reservations (as of December 2023)
(3, 4, '2023-12-01 14:00:00', '2023-12-05', '2024-01-05'),
(8, 5, '2023-12-10 15:00:00', '2023-12-15', '2024-01-15'),
(14, 6, '2023-12-20 16:00:00', '2023-12-25', '2024-01-25'),

-- Future Reservations
(2, 7, '2023-12-25 10:00:00', '2024-01-05', '2024-01-08'),
(6, 8, '2023-12-28 11:00:00', '2024-01-10', '2024-01-13'),
(10, 1, '2023-12-30 09:00:00', '2024-01-15', '2024-01-18');

-- Payments Data
INSERT INTO payments (reservation_id, amount, payment_date, payment_method) VALUES
-- Past Reservation Payments
(1, 450.00, '2023-11-01 10:30:00', 'credit_card'),
(2, 750.00, '2023-11-10 11:30:00', 'paypal'),
(3, 390.00, '2023-11-20 09:30:00', 'cash'),

-- Current Reservation Payments
(4, 420.00, '2023-12-01 14:30:00', 'credit_card'),
(5, 420.00, '2023-12-10 15:30:00', 'paypal'),
(6, 525.00, '2023-12-20 16:30:00', 'cash'),

-- Future Reservation Payments
(7, 480.00, '2023-12-25 10:30:00', 'credit_card'),
(8, 780.00, '2023-12-28 11:30:00', 'paypal'),
(9, 540.00, '2023-12-30 09:30:00', 'cash');
