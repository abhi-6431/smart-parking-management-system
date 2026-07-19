-- Run this once when upgrading a database created from the original Phase 1 schema.
USE smart_parking;

ALTER TABLE parking_slots MODIFY slot_type ENUM('CAR', 'BIKE', 'EV', 'HANDICAP') NOT NULL DEFAULT 'CAR';
ALTER TABLE vehicles ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE bookings ADD COLUMN booking_code VARCHAR(24) NULL UNIQUE AFTER id;
ALTER TABLE bookings ADD COLUMN active_slot_key INT UNSIGNED NULL UNIQUE;
ALTER TABLE bookings ADD COLUMN active_vehicle_key INT UNSIGNED NULL UNIQUE;
UPDATE bookings SET booking_code = CONCAT('LEGACY-', id) WHERE booking_code IS NULL;
ALTER TABLE bookings MODIFY booking_code VARCHAR(24) NOT NULL;

ALTER TABLE payments ADD COLUMN receipt_number VARCHAR(30) NULL UNIQUE AFTER booking_id;
ALTER TABLE payments ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE payments MODIFY payment_method ENUM('CASH', 'UPI', 'CARD') NULL;
UPDATE payments SET receipt_number = CONCAT('LEGACY-RCT-', id) WHERE receipt_number IS NULL;
ALTER TABLE payments MODIFY receipt_number VARCHAR(30) NOT NULL;

ALTER TABLE parking_history ADD COLUMN active_vehicle_key INT UNSIGNED NULL UNIQUE;
ALTER TABLE parking_history ADD COLUMN active_slot_key INT UNSIGNED NULL UNIQUE;
UPDATE bookings SET active_slot_key = slot_id, active_vehicle_key = vehicle_id WHERE booking_status = 'BOOKED';
UPDATE parking_history SET active_slot_key = slot_id, active_vehicle_key = vehicle_id WHERE exit_time IS NULL;

CREATE INDEX idx_payments_status ON payments(payment_status, paid_at);
INSERT IGNORE INTO parking_slots (slot_number, slot_type, zone, level_number) VALUES
('A-01','CAR','A',1), ('A-02','CAR','A',1), ('A-03','EV','A',1),
('A-04','HANDICAP','A',1), ('B-01','BIKE','B',1), ('B-02','BIKE','B',1),
('C-01','CAR','C',2), ('C-02','EV','C',2);

INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@parksmart.local', '$2a$12$J4LFwed4pCPzg.F9mlhYZer5ATv1JpRrl1LWcUtwm/YuypD.PTEQ2', 'ADMIN');
INSERT IGNORE INTO admins (user_id, employee_code)
SELECT id, 'ADMIN-001' FROM users WHERE email = 'admin@parksmart.local';
