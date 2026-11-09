-- FarmVerse database schema for Cloud MySQL
-- Run this script in your MySQL database

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
    farm_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_name VARCHAR(150) NOT NULL,
    farmer_name VARCHAR(150),
    location VARCHAR(255) NOT NULL,
    area DECIMAL(12,2) NOT NULL,
    area_unit VARCHAR(50),
    water_source VARCHAR(100),
    current_crop VARCHAR(150),
    status VARCHAR(50),
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    season VARCHAR(50),
    status VARCHAR(50),
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farms(farm_id)
);

-- If your table already exists in the cloud DB, run these ALTER statements instead:
-- ALTER TABLE farms ADD COLUMN IF NOT EXISTS farmer_name VARCHAR(150);
-- ALTER TABLE farms ADD COLUMN IF NOT EXISTS area_unit VARCHAR(50);
-- ALTER TABLE farms ADD COLUMN IF NOT EXISTS water_source VARCHAR(100);
-- ALTER TABLE farms ADD COLUMN IF NOT EXISTS current_crop VARCHAR(150);
-- ALTER TABLE farms ADD COLUMN IF NOT EXISTS status VARCHAR(50);
-- ALTER TABLE crops ADD COLUMN IF NOT EXISTS status VARCHAR(50);
