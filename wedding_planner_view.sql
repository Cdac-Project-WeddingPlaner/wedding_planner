-- Create a view to display Packages with their associated plans
CREATE VIEW PackageAndPlans AS
SELECT
    pkg.package_id,
    pkg.packagename,
    pp.plan_id,
    p.title AS plan_title,
    p.description AS plan_description,
    p.price AS plan_price
FROM
    package pkg
JOIN
    plan_package pp ON pkg.package_id = pp.package_id
JOIN
    plans p ON pp.plan_id = p.plan_id;

-- Create a view to merge information from users and clients for clients
CREATE VIEW ClientView AS
SELECT
    u.user_id,
    u.password,
    u.phone_number,
    u.email,
    u.first_name,
    u.middle_name,
    u.last_name,
    u.address,
    u.registration_date,
    u.user_type,
    c.client_id,
    c.avatar_image_url
FROM
    users u
JOIN
    clients c ON u.user_id = c.user_id;

-- Create a view to merge information from users and vendors for vendors
CREATE VIEW VendorView AS
SELECT
    u.user_id,
    u.password,
    u.phone_number,
    u.email,
    u.first_name,
    u.middle_name,
    u.last_name,
    u.address,
    u.registration_date,
    u.user_type,
    v.vendor_id,
    v.service_type,
    v.business_name,
    v.contact_email,
    v.altarnet_number,
    v.business_address,
    v.logo_image_url,
    v.description,
    v.edit_date,
    v.is_verified
FROM
    users u
JOIN
    vendors v ON u.user_id = v.user_id;
    
    
-- Create a view named 'weddingselection' to store information about wedding selections
CREATE VIEW weddingselection AS
SELECT
    wd.wd_id,
    wd.client_id,
    p.plan_id,
    p.vendor_id,
    wd.bride_name,
    wd.groom_name,
    wd.wedding_date,
    wps.date,
    wps.time,
    p.title,
    p.price,
    wps.status
FROM
    weddingDetails wd
JOIN
    weddingPlanSelections ws ON wd.wd_id = ws.wd_id
JOIN
    weddingPlanSelections_Plans wps ON ws.selection_id = wps.selection_id
JOIN
    plans p ON wps.plan_id = p.plan_id;
