CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name varchar(64) NOT NULL,
  first_name varchar(64),
  last_name varchar(64),
  password varchar(255) NOT NULL
);