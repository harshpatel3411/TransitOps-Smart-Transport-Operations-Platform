
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL -- Fleet Manager, Driver, Safety Officer, Financial Analyst
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE vehicles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  name_model VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  max_load_capacity DECIMAL(10,2) NOT NULL,
  odometer DECIMAL(10,2) DEFAULT 0,
  acquisition_cost DECIMAL(12,2) NOT NULL,
  region VARCHAR(100),
  status ENUM('Available','On Trip','In Shop','Retired') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_category VARCHAR(20),
  license_expiry_date DATE NOT NULL,
  contact_number VARCHAR(20),
  safety_score DECIMAL(4,1) DEFAULT 100,
  status ENUM('Available','On Trip','Off Duty','Suspended') DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  source VARCHAR(150) NOT NULL,
  destination VARCHAR(150) NOT NULL,
  vehicle_id INT NOT NULL,
  driver_id INT NOT NULL,
  cargo_weight DECIMAL(10,2) NOT NULL,
  planned_distance DECIMAL(10,2) NOT NULL,
  actual_distance DECIMAL(10,2),
  fuel_consumed DECIMAL(10,2),
  status ENUM('Draft','Dispatched','Completed','Cancelled') DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dispatched_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE maintenance_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  status ENUM('Active','Closed') DEFAULT 'Active',
  start_date DATE NOT NULL,
  end_date DATE NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE fuel_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id INT NOT NULL,
  trip_id INT NULL,
  liters DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  log_date DATE NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id INT NOT NULL,
  type VARCHAR(50) NOT NULL, -- toll, other
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  description VARCHAR(255),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);


INSERT INTO roles (name) VALUES 
('Fleet Manager'), 
('Driver'), 
('Safety Officer'), 
('Financial Analyst');