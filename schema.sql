
CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    plate_id VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('active', 'out_of_service', 'rented') DEFAULT 'active',
    office_id INT,
    FOREIGN KEY office_id REFERENCES offices(office_id)
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offices (
    office_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    phone VARCHAR(15)
);

CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    car_id INT NOT NULL,
    customer_id INT NOT NULL,
    office_id INT NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pickup_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP NOT NULL,
    status ENUM('reserved', 'picked_up', 'returned') DEFAULT 'reserved',
    FOREIGN KEY (car_id) REFERENCES cars(car_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (office_id) REFERENCES offices(office_id)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('credit_card', 'cash', 'paypal') DEFAULT 'credit_card',
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);