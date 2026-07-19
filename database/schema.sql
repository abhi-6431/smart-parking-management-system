CREATE DATABASE IF NOT EXISTS smart_parking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_parking;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE parking_slots (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slot_number VARCHAR(20) NOT NULL UNIQUE,
  slot_type ENUM('CAR', 'BIKE', 'EV', 'HANDICAP') NOT NULL DEFAULT 'CAR',
  status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
  zone VARCHAR(30) NOT NULL DEFAULT 'A',
  level_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  vehicle_number VARCHAR(30) NOT NULL UNIQUE,
  vehicle_type ENUM('CAR', 'BIKE') NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vehicle_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(24) NOT NULL UNIQUE,
  user_id INT UNSIGNED NOT NULL,
  vehicle_id INT UNSIGNED NOT NULL,
  slot_id INT UNSIGNED NOT NULL,
  booking_status ENUM('BOOKED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'BOOKED',
  booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  start_time DATETIME NOT NULL,
  end_time DATETIME NULL,
  active_slot_key INT UNSIGNED NULL UNIQUE,
  active_vehicle_key INT UNSIGNED NULL UNIQUE,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  CONSTRAINT fk_booking_slot FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
);

CREATE TABLE payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL UNIQUE,
  receipt_number VARCHAR(30) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  payment_status ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING',
  payment_method ENUM('CASH', 'UPI', 'CARD') NULL,
  paid_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE parking_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NULL,
  vehicle_id INT UNSIGNED NOT NULL,
  slot_id INT UNSIGNED NOT NULL,
  entry_time DATETIME NOT NULL,
  exit_time DATETIME NULL,
  total_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  active_vehicle_key INT UNSIGNED NULL UNIQUE,
  active_slot_key INT UNSIGNED NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_history_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  CONSTRAINT fk_history_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  CONSTRAINT fk_history_slot FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
);

CREATE INDEX idx_slots_status ON parking_slots(status, slot_type);
CREATE INDEX idx_bookings_user ON bookings(user_id, booked_at);
CREATE INDEX idx_history_entry_time ON parking_history(entry_time);
CREATE INDEX idx_payments_status ON payments(payment_status, paid_at);

-- Development administrator account: admin@parksmart.local / Admin@123
-- Change this password immediately after first login in a deployed environment.
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@parksmart.local', '$2a$12$J4LFwed4pCPzg.F9mlhYZer5ATv1JpRrl1LWcUtwm/YuypD.PTEQ2', 'ADMIN');
INSERT IGNORE INTO admins (user_id, employee_code)
SELECT id, 'ADMIN-001' FROM users WHERE email = 'admin@parksmart.local';

INSERT INTO parking_slots (slot_number, slot_type, zone, level_number) VALUES
('A-01','CAR','A',1), ('A-02','CAR','A',1), ('A-03','EV','A',1),
('A-04','HANDICAP','A',1), ('B-01','BIKE','B',1), ('B-02','BIKE','B',1),
('C-01','CAR','C',2), ('C-02','EV','C',2);
