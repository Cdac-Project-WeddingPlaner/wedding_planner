-- Insert sample data for Users table
INSERT INTO users (password, phone_number, email, first_name, middle_name, last_name, address, user_type)
VALUES
    ('password1', '9876543210', 'vendor1@example.com', 'Amit', 'Kumar', 'Sharma', '123 Street, City', 'vendor'),
    ('password2', '9876543211', 'vendor2@example.com', 'Priya', 'Singh', 'Verma', '456 Avenue, Town', 'vendor'),
    ('password3', '9876543212', 'vendor3@example.com', 'Rajesh', 'Gupta', 'Agarwal', '789 Road, Village', 'vendor'),
    ('password4', '9876543213', 'vendor4@example.com', 'Anjali', 'Yadav', 'Sinha', '101 Alley, Metro', 'vendor'),
    ('password5', '9876543214', 'vendor5@example.com', 'Vikas', 'Verma', 'Kumar', '202 Lane, City', 'vendor'),
    ('password6', '9876543215', 'client1@example.com', 'Neha', 'Srivastava', 'Shukla', '456 Street, Town', 'client'),
    ('password7', '9876543216', 'client2@example.com', 'Amit', 'Singh', 'Sharma', '789 Avenue, Village', 'client'),
    ('password8', '9876543217', 'client3@example.com', 'Pooja', 'Verma', 'Gupta', '101 Road, Metro', 'client'),
    ('password9', '9876543218', 'client4@example.com', 'Rahul', 'Yadav', 'Sinha', '202 Alley, City', 'client'),
    ('password10', '9876543219', 'client5@example.com', 'Sneha', 'Kumar', 'Agarwal', '303 Lane, Town', 'client'),
    ('password11', '9876543220', 'admin1@example.com', 'Admin', 'One', 'Super', '404 Street, Village', 'admin'),
    ('password12', '9876543221', 'admin2@example.com', 'Admin', 'Two', 'Mega', '505 Avenue, Metro', 'admin');

-- Insert sample data for Clients table
INSERT INTO clients (user_id, avetar_image_url)
VALUES
    (6, 'avatar1.jpg'),
    (7, 'avatar2.jpg'),
    (8, 'avatar3.jpg'),
    (9, 'avatar4.jpg'),
    (10, 'avatar5.jpg');

-- Insert sample data for Wedding Details table(client)
INSERT INTO weddingDetails (client_id, selected_side, bride_name, groom_name, relation, wedding_date, gest_count)
VALUES
    (1, 'bride', 'Neha Srivastava', 'Amit Sharma', 'Sister', '2024-06-15', 150),
    (2, 'groom', 'Amit Singh', 'Pooja Verma', 'Brother', '2024-07-20', 200),
    (3, 'bride', 'Pooja Verma', 'Rahul Sinha', 'Sister', '2024-08-25', 100),
    (4, 'groom', 'Rahul Yadav', 'Sneha Agarwal', 'Brother', '2024-09-30', 120),
    (5, 'bride', 'Sneha Kumar', 'Vikas Agarwal', 'Sister', '2024-10-15', 180);

-- Insert sample data for Admins table
INSERT INTO admins (user_id)
VALUES
    (11),
    (12);

-- Insert sample data for Vendors table
INSERT INTO vendors (user_id, service_type, business_name, contact_email, altarnet_number, business_address, logo_image_url, description)
VALUES
    (1, 'Hall', 'Dream Hall', 'vendor1@example.com', '9876543210', '123 Street, City', 'logo1.jpg', 'A beautiful venue for your special day.'),
    (2, 'Catering', 'Delicious Delights', 'vendor2@example.com', '9876543211', '456 Avenue, Town', 'logo2.jpg', 'Exquisite catering services for your events.'),
    (3, 'Music', 'Melody Makers', 'vendor3@example.com', '9876543212', '789 Road, Village', 'logo3.jpg', 'Creating unforgettable musical experiences.'),
    (4, 'Photography', 'Perfect Shots', 'vendor4@example.com', '9876543213', '101 Alley, Metro', 'logo4.jpg', 'Capturing your special moments with perfection.'),
    (5, 'Decoration', 'Elegant Decor', 'vendor5@example.com', '9876543214', '202 Lane, City', 'logo5.jpg', 'Transforming spaces into dreamy environments.');

-- Insert sample data for Halls table(vendor)
INSERT INTO halls (vendor_id, hall_name, capacity, address, rental_fee, amenities, is_verified)
VALUES
    (1, 'Dream Hall A', 200, '123 Street, City', 5000.00, 'Air Conditioning, Parking', 1),
    (1, 'Elegant Hall B', 150, '202 Lane, City', 4500.00, 'Decoration, Sound System', 1);


-- Insert sample data for Plans table(vendor-admin)
INSERT INTO plans (vendor_id, title, description, price, is_verified)
VALUES
    (1, 'Standard Package', 'Basic hall rental with essentials', 3000.00, 'verified'),
    (1, 'Premium Package', 'Enhanced hall', 5000.00, 'verified'),
    (2, 'Deluxe Catering', 'Premium catering services for your events', 2500.00, 'verified'),
    (2, 'Custom Menu', 'Tailored catering options for your preferences', 4000.00, 'verified'),
    (3, 'Music Bliss', 'Live music performance to enhance your celebrations', 2000.00, 'verified'),
    (3, 'DJ Services', 'Professional DJ services for a lively atmosphere', 3000.00, 'verified'),
    (4, 'Photography Package', 'Professional photography coverage', 3500.00, 'verified'),
    (4, 'Videography Add-On', 'Capture your moments on video', 2000.00, 'verified'),
    (5, 'Complete Decoration', 'Comprehensive decoration services for your venue', 4000.00, 'verified'),
    (5, 'Theme Decor', 'Customized theme-based decoration', 6000.00, 'verified');

-- Insert sample data for Vendor Images table(vendor)
INSERT INTO vendor_images (vendor_id, plan_id, image_url, description)
VALUES
    (1, 1, 'image1.jpg', 'Dream Hall Interior'),
    (2, 2, 'image2.jpg', 'Delicious Catering Setup'),
    (3, 3, 'image3.jpg', 'Melody Makers Performing Live'),
    (4, 4, 'image4.jpg', 'Perfect Shots Photography Samples'),
    (5, 5, 'image5.jpg', 'Elegant Decor Setups');

-- Insert sample data for Wedding Plan Selections table(client)
INSERT INTO weddingPlanSelections (wd_id)
VALUES
    (1),
    (2),
    (3),
    (4),
    (5);

-- Insert sample data for Wedding Plan Selections_Plans table(vendor-client)
-- Insert sample data for Wedding Plan Selections_Plans table(vendor-client)
INSERT INTO weddingPlanSelections_Plans (selection_id, plan_id, date, time, status)
VALUES
    (1, 2, '2024-06-15', '18:00:00', 'confirmed'),
    (1, 4, '2024-07-20', '20:00:00', 'confirmed'),
    (1, 6, '2024-08-25', '15:30:00', 'pending'),
    (1, 8, '2024-09-30', '19:00:00', 'confirmed'),
    (1, 10, '2024-10-15', '21:30:00', 'pending'),
    (2, 3, '2024-06-15', '22:00:00', 'confirmed'),
    (2, 5, '2024-07-20', '16:30:00', 'confirmed'),
    (2, 7, '2024-08-25', '18:00:00', 'pending'),
    (2, 9, '2024-09-30', '21:30:00', 'confirmed'),
    (2, 1, '2024-10-15', '14:00:00', 'pending'),
    (3, 9, '2024-06-15', '16:30:00', 'confirmed'),
    (3, 7, '2024-07-20', '19:00:00', 'pending'),
    (3, 5, '2024-08-25', '14:00:00', 'confirmed'),
    (3, 3, '2024-09-30', '17:30:00', 'confirmed'),
    (3, 2, '2024-10-15', '20:00:00', 'pending'),
    (4, 8, '2024-06-15', '18:30:00', 'confirmed'),
    (4, 6, '2024-07-20', '21:00:00', 'confirmed'),
    (4, 4, '2024-08-25', '15:30:00', 'pending'),
    (4, 2, '2024-09-30', '19:00:00', 'confirmed'),
    (4, 10, '2024-10-15', '21:30:00', 'pending'),
    (5, 2, '2024-06-15', '22:00:00', 'confirmed'),
    (5, 4, '2024-07-20', '16:30:00', 'confirmed'),
    (5, 6, '2024-08-25', '18:00:00', 'pending'),
    (5, 8, '2024-09-30', '21:30:00', 'confirmed'),
    (5, 10, '2024-10-15', '14:00:00', 'pending');

    
-- Insert sample data for Reviews table(client-vendor)
INSERT INTO reviews (plan_id, client_id, review)
VALUES
    (1, 1, 'Excellent venue and service!'),
    (2, 2, 'Delicious food, great catering service!'),
    (3, 3, 'Amazing musical performance, highly recommended!'),
    (4, 1, 'Photography team captured our special moments beautifully.'),
    (5, 1, 'Elegant decoration, made our event memorable.');
