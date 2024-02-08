-- Create Database
CREATE DATABASE IF NOT EXISTS wedding_planner;

-- Use the Database
USE wedding_planner;

-- Create Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255),
    phone_number VARCHAR(15),
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    address VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_type ENUM('vendor', 'client', 'admin')
);

-- Create Vendors table
CREATE TABLE vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    service_type ENUM('Hall', 'Catering', 'Music', 'Photography', 'Decoration'),
    business_name VARCHAR(255),
    contact_email VARCHAR(255),
    altarnet_number VARCHAR(15),
    business_address VARCHAR(255),
    logo_image_url VARCHAR(255),
    description TEXT,
    edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Clients table
CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    avetar_image_url VARCHAR(255),
    edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Wedding Details table(client)
CREATE TABLE weddingDetails (
    wd_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    selected_side ENUM('groom', 'bride') DEFAULT NULL,
    bride_name VARCHAR(100) DEFAULT NULL,
    groom_name VARCHAR(100) DEFAULT NULL,
    relation VARCHAR(100) DEFAULT NULL,
    wedding_date DATE,
    gest_count INT(6),
    add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Create Admins table
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Halls table(vendor)
CREATE TABLE halls (
    hall_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT,
    hall_name VARCHAR(100),
    capacity INT,
    address VARCHAR(255),
    rental_fee DECIMAL(10, 2),
    amenities TEXT,
    is_verified BOOLEAN DEFAULT 0,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id)
);

-- Create Plans Table(vendor-admin)
CREATE TABLE plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_verified VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id)
);

-- Create Vendor Images Table(vendor)
CREATE TABLE vendor_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT,
    plan_id INT,
    image_url VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id)
);

-- Create Client Plan Selections Table(client)
CREATE TABLE weddingPlanSelections (
    selection_id INT AUTO_INCREMENT PRIMARY KEY,
    wd_id INT,
    selection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wd_id) REFERENCES weddingDetails(wd_id)
);

-- Create Junction Table for Wedding Plan Selections and Plans(vendor-client)
CREATE TABLE weddingPlanSelections_Plans (
    selection_id INT,
    plan_id INT,
    date DATE,
    time TIME,
    status VARCHAR(9),
    PRIMARY KEY (selection_id, plan_id),
    FOREIGN KEY (selection_id) REFERENCES weddingPlanSelections(selection_id),
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id)
);

-- Create Package Table(admin)
CREATE TABLE package (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    packagename VARCHAR(100)
);

-- Create Junction Table for Plans and Packages(admin)
CREATE TABLE plan_package (
    plan_id INT,
    package_id INT,
    PRIMARY KEY (plan_id, package_id),
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id),
    FOREIGN KEY (package_id) REFERENCES package(package_id)
);

-- Create Reviews table(client-vendor)
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT,
    client_id INT,
    review VARCHAR(255),
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);
    
 
