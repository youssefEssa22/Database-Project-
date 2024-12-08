-- Creation

CREATE TABLE users(
	user_id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(511) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) VIRTUAL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE cars(
	plate_id varchar(255) PRIMARY KEY,
    model varchar(255),
    `year` YEAR,
    color varchar(30),
    `status` varchar(10)
);