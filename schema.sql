CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offices (
    office_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    phone VARCHAR(15)
);

CREATE TYPE car_status AS ENUM ('active', 'out_of_service', 'rented');

CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    plate_id VARCHAR(50) UNIQUE NOT NULL,
    status car_status DEFAULT 'active',
    office_id INT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (office_id) REFERENCES offices(office_id)
);

CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    car_id INT NOT NULL,
    customer_id INT NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pickup_date  DATE NOT NULL,
    return_date  DATE NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(car_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TYPE method AS ENUM ('credit_card', 'cash', 'paypal');

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method  method DEFAULT 'credit_card',
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);

CREATE OR REPLACE FUNCTION delete_cars_on_office_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM cars WHERE office_id = OLD.office_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_cars_on_office_delete
BEFORE DELETE ON offices
FOR EACH ROW
EXECUTE FUNCTION delete_cars_on_office_delete();


CREATE OR REPLACE FUNCTION delete_reservations_and_payments_on_car_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete payments associated with reservations for the car
    DELETE FROM payments
    WHERE reservation_id IN (
        SELECT reservation_id FROM reservations WHERE car_id = OLD.car_id
    );

    -- Delete reservations for the car
    DELETE FROM reservations WHERE car_id = OLD.car_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_reservations_and_payments_on_car_delete
AFTER DELETE ON cars
FOR EACH ROW
EXECUTE FUNCTION delete_reservations_and_payments_on_car_delete();