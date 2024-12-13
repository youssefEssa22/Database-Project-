CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    user_password TEXT NOT NULL
);

CREATE TABLE cars (
    plate_id TEXT PRIMARY KEY,
    model TEXT,
    year INTEGER,
    color TEXT,
    status TEXT
);
